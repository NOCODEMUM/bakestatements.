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

const FUNCTION_VERSION = "confirm-checkout-session@2025-11-02-1";

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

        const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);

        // Authenticate end-user
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return new Response(
                JSON.stringify({ error: "No authorization header" }),
                { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json", "X-Function-Version": FUNCTION_VERSION } }
            );
        }

        // Validate user using either anon client or admin client
        const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } },
        });
        let { data: { user }, error: userError } = await userSupabase.auth.getUser();
        if (userError || !user) {
            try {
                const token = authHeader.replace(/^Bearer\s+/i, "").trim();
                const { data: { user: adminUser }, error: adminUserError } = await adminSupabase.auth.getUser(token);
                if (adminUserError || !adminUser) {
                    return new Response(
                        JSON.stringify({ error: "Unauthorized" }),
                        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json", "X-Function-Version": FUNCTION_VERSION } }
                    );
                }
                user = adminUser;
            } catch {
                return new Response(
                    JSON.stringify({ error: "Unauthorized" }),
                    { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json", "X-Function-Version": FUNCTION_VERSION } }
                );
            }
        }

        const { sessionId } = await req.json();
        if (!sessionId) {
            return new Response(
                JSON.stringify({ error: "sessionId is required" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json", "X-Function-Version": FUNCTION_VERSION } }
            );
        }

        // Retrieve the Checkout Session with subscription expanded when possible
        const session: any = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["subscription"] });
        if (!session) {
            return new Response(
                JSON.stringify({ error: "Checkout session not found" }),
                { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json", "X-Function-Version": FUNCTION_VERSION } }
            );
        }

        // Determine which user to update
        const metadataUserId = (session.metadata as any)?.user_id as string | undefined;
        const customerId = session.customer as string | undefined;
        const customerEmail = (session.customer_details as any)?.email as string | undefined;

        // Security: the caller must match the session user when available
        if (metadataUserId && metadataUserId !== user!.id) {
            return new Response(
                JSON.stringify({ error: "Forbidden: session does not belong to caller" }),
                { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json", "X-Function-Version": FUNCTION_VERSION } }
            );
        }

        const updateData: any = {
            subscription_status: "active",
            stripe_customer_id: customerId || null,
        };

        if (session.mode === "subscription") {
            let subscription: any = null;
            if (session.subscription && typeof session.subscription === "object") {
                subscription = session.subscription;
            } else if (session.subscription && typeof session.subscription === "string") {
                subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            } else if (session.customer) {
                // Fallback: find an active subscription for this customer
                const list = await stripe.subscriptions.list({ customer: session.customer as string, status: "active", limit: 1 });
                subscription = list.data?.[0] || null;
            }

            if (subscription) {
                const interval = subscription.items.data[0]?.price.recurring?.interval;
                updateData.subscription_tier = interval === "year" ? "annual" : "monthly";
                updateData.subscription_id = subscription.id;
                updateData.subscription_end_date = null;
            }
        } else {
            // One-off lifetime payment
            updateData.subscription_status = "lifetime";
            updateData.subscription_tier = "lifetime";
            updateData.subscription_id = null;
            updateData.subscription_end_date = null;
        }

        // Apply update by user id when available, else by email
        if (metadataUserId) {
            await adminSupabase
                .from("profiles")
                .update(updateData)
                .eq("id", metadataUserId);
        } else if (customerEmail) {
            await adminSupabase
                .from("profiles")
                .update({ ...updateData, stripe_customer_id: customerId || null })
                .eq("email", customerEmail);
        } else {
            // Last resort: try by caller user id
            await adminSupabase
                .from("profiles")
                .update(updateData)
                .eq("id", user!.id);
        }

        return new Response(
            JSON.stringify({ ok: true, applied: true, session_id: session.id, tier: updateData.subscription_tier, status: updateData.subscription_status }),
            { headers: { ...corsHeaders, "Content-Type": "application/json", "X-Function-Version": FUNCTION_VERSION } }
        );
    } catch (error: any) {
        console.error("Confirm checkout error:", error);
        return new Response(
            JSON.stringify({ error: error?.message || "Failed to confirm checkout" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json", "X-Function-Version": FUNCTION_VERSION } }
        );
    }
});


