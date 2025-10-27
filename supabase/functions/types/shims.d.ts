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
        };
        checkout: {
            sessions: {
                create(params: Record<string, unknown>): Promise<{ id: string; url: string | null }>;
            };
        };
        customers: {
            create(params: Record<string, unknown>): Promise<{ id: string }>;
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
