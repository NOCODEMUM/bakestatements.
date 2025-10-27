import { Response } from 'express';
import Stripe from 'stripe';
import { AuthRequest } from '../middleware/auth.js';
import { query } from '../config/database.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  try {
    const { priceId, mode = 'subscription' } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    const userResult = await query(
      'SELECT stripe_customer_id, business_name, email FROM users WHERE id = $1',
      [req.user!.userId]
    );

    const user = userResult.rows[0];
    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.business_name || undefined,
        metadata: {
          user_id: req.user!.userId,
        },
      });
      customerId = customer.id;

      await query(
        'UPDATE users SET stripe_customer_id = $1 WHERE id = $2',
        [customerId, req.user!.userId]
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      billing_address_collection: 'required',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode as 'subscription' | 'payment',
      success_url: `${process.env.FRONTEND_URL}/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/?cancelled=true`,
      metadata: {
        user_id: req.user!.userId,
      },
      allow_promotion_codes: true,
    });

    res.json({
      url: session.url,
      session_id: session.id,
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const handleWebhook = async (req: AuthRequest, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;

        if (userId) {
          const updateData: any = {
            subscription_status: 'active',
            stripe_customer_id: session.customer,
          };

          if (session.mode === 'subscription') {
            updateData.subscription_id = session.subscription;
            updateData.subscription_tier = 'monthly';
          } else if (session.mode === 'payment') {
            updateData.subscription_status = 'lifetime';
            updateData.subscription_tier = 'lifetime';
            updateData.subscription_id = null;
          }

          await query(
            `UPDATE users
             SET subscription_status = $1,
                 stripe_customer_id = $2,
                 subscription_id = $3,
                 subscription_tier = $4
             WHERE id = $5`,
            [
              updateData.subscription_status,
              updateData.stripe_customer_id,
              updateData.subscription_id,
              updateData.subscription_tier,
              userId,
            ]
          );

          console.log('Successfully updated profile for checkout session:', session.id);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        let tier = 'monthly';
        if (subscription.items.data[0]?.price.recurring?.interval === 'year') {
          tier = 'annual';
        }

        await query(
          `UPDATE users
           SET subscription_status = $1,
               subscription_tier = $2,
               subscription_id = $3
           WHERE stripe_customer_id = $4`,
          [subscription.status, tier, subscription.id, subscription.customer]
        );

        console.log('Successfully updated subscription:', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await query(
          `UPDATE users
           SET subscription_status = 'cancelled',
               subscription_end_date = NOW()
           WHERE stripe_customer_id = $1`,
          [subscription.customer]
        );

        console.log('Successfully processed subscription deletion:', subscription.id);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          await query(
            `UPDATE users
             SET subscription_status = 'active'
             WHERE stripe_customer_id = $1`,
            [invoice.customer]
          );
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          await query(
            `UPDATE users
             SET subscription_status = 'past_due'
             WHERE stripe_customer_id = $1`,
            [invoice.customer]
          );
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

export const getSubscriptionStatus = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT subscription_status, subscription_tier, trial_end_date FROM users WHERE id = $1',
      [req.user!.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    const trialEnd = new Date(user.trial_end_date);
    const now = new Date();
    const trialExpired = now > trialEnd;
    const hasActiveSubscription = user.subscription_status === 'active' || user.subscription_status === 'lifetime';

    res.json({
      subscription_status: user.subscription_status,
      subscription_tier: user.subscription_tier,
      trial_end_date: user.trial_end_date,
      trial_expired: trialExpired,
      has_active_subscription: hasActiveSubscription,
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
};
