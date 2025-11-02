/// <reference path="../deno.d.ts" />

// Minimal local types so editors/ESLint can resolve `import Stripe from "stripe"`
// and the `Stripe.*` namespace types used in Edge Functions. Runtime uses Deno/npm.
declare module "stripe" {
    export default class Stripe {
        constructor(apiKey: string, config?: { apiVersion?: string });
        webhooks: {
            constructEvent(payload: string | Uint8Array, header: string, secret: string): Stripe.Event;
        };
        subscriptions: {
            retrieve(id: string): Promise<Stripe.Subscription>;
            list(params: { customer?: string; status?: string; limit?: number }): Promise<{ data: Stripe.Subscription[] }>;
        };
        checkout: {
            sessions: {
                create(params: Record<string, unknown>): Promise<{ id: string; url: string | null }>;
                retrieve(id: string, params?: { expand?: string[] }): Promise<Stripe.Checkout.Session | (Stripe.Checkout.Session & { subscription?: Stripe.Subscription | string | null })>;
            };
        };
        customers: {
            create(params: Record<string, unknown>): Promise<{ id: string }>; 
            retrieve(id: string): Promise<{ id: string; email?: string | null }>; 
        };
    }

    // Namespace mirrors what the official types expose; we only model what we use.
    export namespace Stripe {
        interface Event {
            id: string;
            type: string;
            data: { object: unknown };
        }

        namespace Checkout {
            interface Session {
                id: string;
                mode?: "payment" | "subscription" | null;
                subscription?: string | null;
                customer?: string | null;
                metadata?: Record<string, string> | null;
                customer_details?: { email?: string | null } | null;
            }
        }

        interface SubscriptionItemPriceRecurring {
            interval?: "day" | "week" | "month" | "year";
        }

        interface SubscriptionItemPrice {
            recurring?: SubscriptionItemPriceRecurring | null;
        }

        interface SubscriptionItem {
            price: SubscriptionItemPrice;
        }

        interface Subscription {
            id: string;
            status: string;
            customer: string | null;
            items: { data: SubscriptionItem[] };
        }

        interface Invoice {
            id: string;
            subscription?: string | null;
            customer?: string | null;
        }
    }
}
