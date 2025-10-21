import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@14.21.0";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

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
    console.log("[Edge Function] Create checkout session started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("[Edge Function] Missing STRIPE_SECRET_KEY");
      return new Response(
        JSON.stringify({ error: "Stripe configuration error. Please contact support." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2024-11-20.acacia",
    });

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[Edge Function] Missing Supabase configuration");
      return new Response(
        JSON.stringify({ error: "Configuration error. Please contact support." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get("Authorization");
    console.log("[Edge Function] Auth header present:", !!authHeader);

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header. Please sign in and try again." }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    console.log("[Edge Function] User authentication:", {
      hasUser: !!user,
      userId: user?.id,
      error: userError?.message
    });

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Please sign in and try again." }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const requestBody = await req.json();
    console.log("[Edge Function] Request body:", requestBody);

    const { priceId, mode } = requestBody;

    if (!priceId) {
      console.error("[Edge Function] Missing priceId in request");
      return new Response(
        JSON.stringify({ error: "Price ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("[Edge Function] Fetching user profile");
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, business_name, email")
      .eq("id", user.id)
      .maybeSingle();

    console.log("[Edge Function] Profile data:", {
      hasProfile: !!profile,
      hasStripeCustomer: !!profile?.stripe_customer_id
    });

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      console.log("[Edge Function] Creating new Stripe customer");
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.business_name || undefined,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;
      console.log("[Edge Function] Created Stripe customer:", customerId);

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://bakestatements.com";
    console.log("[Edge Function] Creating Stripe checkout session:", {
      priceId,
      mode,
      customerId,
      frontendUrl
    });

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
      success_url: `${frontendUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/pricing?cancelled=true`,
      metadata: {
        user_id: user.id,
      },
      allow_promotion_codes: true,
    });

    console.log("[Edge Function] Checkout session created:", session.id);

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
    console.error("[Edge Function] Error:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to create checkout session",
        details: error.type || "Unknown error type"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
