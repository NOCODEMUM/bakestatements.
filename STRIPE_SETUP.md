# Stripe Payment Integration Setup Guide

This guide will help you complete the Stripe payment integration for BakeStatements.

## Overview

The Stripe payment integration has been implemented with:
- **Pricing page** at `/pricing` with 3 tiers (Monthly, Annual, Lifetime)
- **Paywall modal** that appears when trial expires
- **Supabase Edge Functions** for secure payment processing
- **Webhook handling** for subscription management
- **Database integration** to track subscription status

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Access to your Stripe Dashboard
3. Access to your Supabase project settings

## Step 1: Create Stripe Products & Prices

### 1.1 Create Monthly Subscription Product

1. Go to https://dashboard.stripe.com/products
2. Click **"+ Add product"**
3. Fill in the details:
   - **Name**: BakeStatements Monthly
   - **Description**: Monthly subscription to BakeStatements
   - **Pricing model**: Standard pricing
   - **Price**: 19 AUD
   - **Billing period**: Monthly (recurring every 1 month)
4. Click **"Save product"**
5. **Copy the Price ID** (starts with `price_`) - you'll need this later

### 1.2 Create Annual Subscription Product

1. Click **"+ Add product"** again
2. Fill in the details:
   - **Name**: BakeStatements Annual
   - **Description**: Annual subscription to BakeStatements (Save $48!)
   - **Pricing model**: Standard pricing
   - **Price**: 180 AUD
   - **Billing period**: Yearly (recurring every 12 months)
3. Click **"Save product"**
4. **Copy the Price ID** - you'll need this later

### 1.3 Create Lifetime Payment Product

1. Click **"+ Add product"** again
2. Fill in the details:
   - **Name**: BakeStatements Founder's Lifetime
   - **Description**: One-time payment for lifetime access
   - **Pricing model**: Standard pricing
   - **Price**: 299 AUD
   - **Billing period**: One time (not recurring)
3. Click **"Save product"**
4. **Copy the Price ID** - you'll need this later

## Step 2: Configure Frontend Environment Variables

Update your `.env` file with the Stripe Price IDs you just created:

```env
VITE_STRIPE_PRICE_MONTHLY=price_YOUR_MONTHLY_PRICE_ID
VITE_STRIPE_PRICE_ANNUAL=price_YOUR_ANNUAL_PRICE_ID
VITE_STRIPE_PRICE_LIFETIME=price_YOUR_LIFETIME_PRICE_ID
```

## Step 3: Configure Supabase Edge Function Secrets

### 3.1 Get Your Stripe Secret Key

1. Go to https://dashboard.stripe.com/apikeys
2. Find your **Secret key** (starts with `sk_`)
3. Click to reveal and copy it

### 3.2 Set Supabase Secrets

Run these commands in your terminal (replace the values):

```bash
# Set Stripe secret key
supabase secrets set STRIPE_SECRET_KEY=sk_your_stripe_secret_key

# Set your production frontend URL
supabase secrets set FRONTEND_URL=https://bakestatements.com
```

## Step 4: Configure Stripe Webhooks

### 4.1 Get Your Webhook Endpoint URL

Your webhook URL is:
```
https://ehwvvqefxmorpwkruohn.supabase.co/functions/v1/stripe-webhooks
```

### 4.2 Create Webhook in Stripe

1. Go to https://dashboard.stripe.com/webhooks
2. Click **"+ Add endpoint"**
3. Enter your webhook URL (from above)
4. Click **"Select events"**
5. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Click **"Add endpoint"**
7. **Copy the Signing secret** (starts with `whsec_`)

### 4.3 Set Webhook Secret in Supabase

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Step 5: Test the Integration

### 5.1 Enable Stripe Test Mode

1. In your Stripe Dashboard, toggle to **Test mode** (top right)
2. Repeat Steps 1-4 using your test mode keys
3. Use test card: `4242 4242 4242 4242` with any future expiry date and any CVC

### 5.2 Test the Flow

1. Start your application: `npm run dev`
2. Sign up for a new account (7-day trial starts)
3. Navigate to `/pricing` to see the pricing page
4. Click on a plan button
5. Complete the Stripe checkout with test card
6. Verify you're redirected back to the app
7. Check that your subscription status is updated in the database

### 5.3 Test Webhook Handling

1. In Stripe Dashboard, go to **Webhooks** > Your endpoint
2. Click **"Send test webhook"**
3. Select `checkout.session.completed`
4. Check that the webhook was received successfully (200 status)
5. Verify the subscription status updated in your Supabase `profiles` table

## Step 6: Go Live

### 6.1 Switch to Live Mode

1. Toggle Stripe to **Live mode**
2. Complete Steps 1-4 again with **live** keys (not test keys)
3. Update your production environment variables with live price IDs
4. Deploy your changes

### 6.2 Monitor Payments

- View payments: https://dashboard.stripe.com/payments
- View subscriptions: https://dashboard.stripe.com/subscriptions
- View webhooks: https://dashboard.stripe.com/webhooks
- View customers: https://dashboard.stripe.com/customers

## Subscription Status Flow

The system tracks these subscription states in the `profiles` table:

- **trial** - User in 7-day free trial (default)
- **active** - Paid subscription is active
- **past_due** - Payment failed, subscription at risk
- **cancelled** - Subscription cancelled
- **lifetime** - One-time lifetime payment completed

## Troubleshooting

### Webhooks Not Working

1. Check webhook logs in Stripe Dashboard
2. Verify signing secret is correct in Supabase
3. Check Supabase Function logs for errors
4. Ensure all required events are selected

### Checkout Session Not Creating

1. Verify Stripe secret key is set correctly
2. Check browser console for errors
3. Verify Edge Function is deployed: `supabase functions list`
4. Check Edge Function logs: `supabase functions logs create-checkout-session`

### Subscription Not Updating

1. Check webhook received in Stripe Dashboard
2. Verify webhook secret is correct
3. Check `profiles` table for `stripe_customer_id`
4. Check Supabase logs for database errors

## Support Resources

- Stripe Documentation: https://stripe.com/docs
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
- BakeStatements Support: Contact your development team

## Security Notes

- Never commit Stripe secret keys to version control
- Always use HTTPS for webhook endpoints
- Verify webhook signatures on every webhook request
- Use Stripe test mode for development
- Keep Stripe SDK updated for security patches

## Next Steps

After setup is complete:

1. Test all three pricing tiers thoroughly
2. Monitor the first few payments closely
3. Set up Stripe email receipts for customers
4. Configure Stripe invoice settings
5. Set up tax collection if required (Stripe Tax)
6. Consider adding promotional codes support

---

**Implementation Complete! 🎉**

Your payment system is now ready to accept subscriptions from Australian bakers. The system will automatically:
- Create Stripe customers
- Process payments securely
- Update subscription statuses
- Handle trial expirations
- Show paywall when needed
