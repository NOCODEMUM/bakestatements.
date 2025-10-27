/// <reference path="../deno.d.ts" />
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, stripe-signature",
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

    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "No signature provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.text();
    let event: any;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(
        JSON.stringify({ error: `Webhook Error: ${err.message}` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session.metadata?.user_id;

        if (userId) {
          const updateData: any = {
            subscription_status: "active",
            stripe_customer_id: session.customer,
          };

          if (session.mode === "subscription") {
            updateData.subscription_id = session.subscription;

            const subscription = await stripe.subscriptions.retrieve(
              session.subscription as string
            );

            const interval = subscription.items.data[0]?.price.recurring?.interval;
            updateData.subscription_tier = interval === "year" ? "annual" : "monthly";
          } else if (session.mode === "payment") {
            updateData.subscription_status = "lifetime";
            updateData.subscription_tier = "lifetime";
            updateData.subscription_id = null;
          }

          await supabase
            .from("profiles")
            .update(updateData)
            .eq("id", userId);

          console.log("Successfully updated profile for checkout session:", session.id);
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as any;

        let tier = "monthly";
        if (subscription.items.data[0]?.price.recurring?.interval === "year") {
          tier = "annual";
        }

        await supabase
          .from("profiles")
          .update({
            subscription_status: subscription.status,
            subscription_tier: tier,
            subscription_id: subscription.id,
          })
          .eq("stripe_customer_id", subscription.customer as string);

        console.log("Successfully updated subscription:", subscription.id);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;

        await supabase
          .from("profiles")
          .update({
            subscription_status: "cancelled",
            subscription_end_date: new Date().toISOString(),
          })
          .eq("stripe_customer_id", subscription.customer as string);

        console.log("Successfully processed subscription deletion:", subscription.id);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;

        if (invoice.subscription) {
          await supabase
            .from("profiles")
            .update({ subscription_status: "active" })
            .eq("stripe_customer_id", invoice.customer as string);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;

        if (invoice.subscription) {
          await supabase
            .from("profiles")
            .update({ subscription_status: "past_due" })
            .eq("stripe_customer_id", invoice.customer as string);
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook processing failed" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
