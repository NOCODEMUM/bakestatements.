// Use Stripe server SDK via import map
/// <reference path="../deno.d.ts" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, apikey, Apikey",
};

const FUNCTION_VERSION = "create-checkout-session@2025-11-02-1";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: { ...corsHeaders, "X-Function-Version": FUNCTION_VERSION },
    });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2024-11-20.acacia",
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    // Privileged client for DB writes (bypasses RLS)
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json", "X-Function-Version": FUNCTION_VERSION },
        }
      );
    }

    // End-user authenticated client via Authorization header
    const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    let { data: { user }, error: userError } = await userSupabase.auth.getUser();

    // Fallback: try verifying the JWT directly via admin client if the above fails
    if (userError || !user) {
      try {
        const token = authHeader.replace(/^Bearer\s+/i, "").trim();
        const { data: { user: adminUser }, error: adminUserError } = await adminSupabase.auth.getUser(token);
        if (adminUserError || !adminUser) {
          console.error("Auth getUser failed", { userError, adminUserError });
          return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            {
              status: 401,
              headers: { ...corsHeaders, "Content-Type": "application/json", "X-Function-Version": FUNCTION_VERSION },
            }
          );
        }
        user = adminUser;
      } catch (e) {
        console.error("Auth verification exception", e);
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json", "X-Function-Version": FUNCTION_VERSION },
          }
        );
      }
    }

    const body = await req.json();
    const plan = (body.plan || '').toLowerCase();
    const returnUrl = body.returnUrl;
    const successPath = body.successPath;
    const cancelPath = body.cancelPath;

    // Map plan -> price id from Supabase secrets; allow explicit priceId for backward compatibility
    const planToPrice: Record<string, string> = {
      monthly: Deno.env.get("STRIPE_PRICE_MONTHLY") || "",
      annual: Deno.env.get("STRIPE_PRICE_ANNUAL") || "",
      lifetime: Deno.env.get("STRIPE_PRICE_LIFETIME") || "",
    };

    const priceId = body.priceId || planToPrice[plan];
    const mode = body.mode || (plan === "lifetime" ? "payment" : "subscription");

    if (!priceId) {
      return new Response(
        JSON.stringify({ error: "Price ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json", "X-Function-Version": FUNCTION_VERSION },
        }
      );
    }

    const { data: profile } = await adminSupabase
      .from("profiles")
      .select("stripe_customer_id, business_name, email")
      .eq("id", user!.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user!.email,
        name: profile?.business_name || undefined,
        metadata: {
          user_id: user!.id,
        },
      });
      customerId = customer.id;

      await adminSupabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user!.id);
    }

    const frontendUrl = Deno.env.get("VITE_FRONTEND_URL");
    console.log("frontendUrl", frontendUrl);
    // const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://bakestatements.com";
    const baseUrl = (returnUrl && typeof returnUrl === 'string' && returnUrl.startsWith('http')) ? returnUrl : frontendUrl;
    const safeSuccessPath = (typeof successPath === 'string' && successPath.startsWith('/')) ? successPath : '/settings';
    const safeCancelPath = (typeof cancelPath === 'string' && cancelPath.startsWith('/')) ? cancelPath : '/pricing';

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
      success_url: `${baseUrl}${safeSuccessPath}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${safeCancelPath}?cancelled=true`,
      metadata: {
        user_id: user!.id,
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
          "X-Function-Version": FUNCTION_VERSION,
        },
      }
    );
  } catch (error: any) {
    console.error("Create checkout session error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create checkout session" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json", "X-Function-Version": FUNCTION_VERSION },
      }
    );
  }
});
