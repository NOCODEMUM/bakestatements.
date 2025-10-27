// Use Stripe server SDK via import map
/// <reference path="../deno.d.ts" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2024-11-20.acacia",
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { priceId, mode, returnUrl } = await req.json();

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: "Price ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, business_name, email")
      .eq("id", user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.business_name || undefined,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://bakestatements.com";
    const baseUrl = (returnUrl && typeof returnUrl === 'string' && returnUrl.startsWith('http')) ? returnUrl : frontendUrl;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      billing_address_collection: "required",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode as "subscription" | "payment",
      success_url: `${baseUrl}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?cancelled=true`,
      metadata: {
        user_id: user.id,
      },
      allow_promotion_codes: true,
    });

    return new Response(
      JSON.stringify({
        url: session.url,
        session_id: session.id,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Create checkout session error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create checkout session" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
