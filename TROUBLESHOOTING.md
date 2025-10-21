# Troubleshooting Stripe Integration

## Common Issues with Pricing Page Buttons

### Issue: "Failed to fetch" error when clicking subscription buttons

This error typically occurs when the Supabase Edge Function cannot be reached or is misconfigured.

#### Debugging Steps:

1. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for detailed error messages with `[Stripe API]` or `[Pricing]` prefixes
   - Check for authentication status and request details

2. **Verify Supabase Edge Function Logs**
   - Go to Supabase Dashboard > Edge Functions > create-checkout-session
   - Click on "Logs" to see real-time function execution
   - Look for error messages with `[Edge Function]` prefix

3. **Check Environment Variables**

   **Frontend (.env file):**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_STRIPE_PRICE_MONTHLY=price_xxx
   VITE_STRIPE_PRICE_ANNUAL=price_xxx
   VITE_STRIPE_PRICE_LIFETIME=price_xxx
   ```

   **Supabase Edge Function Secrets (Configured in Supabase Dashboard):**
   - `STRIPE_SECRET_KEY` - Your Stripe secret key (sk_test_... or sk_live_...)
   - `FRONTEND_URL` - Your frontend URL (e.g., http://localhost:5173 or https://yourdomain.com)
   - `SUPABASE_URL` - Automatically set by Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` - Automatically set by Supabase

4. **Verify Stripe Configuration**
   - Go to Stripe Dashboard > Products
   - Confirm the three price IDs exist and match your .env file
   - Monthly: Should be recurring/monthly
   - Annual: Should be recurring/yearly
   - Lifetime: Should be one-time payment

5. **Test Authentication**
   - Make sure you're logged in before clicking subscription buttons
   - Check that your session is valid (not expired)
   - Try logging out and back in if issues persist

6. **Common Error Messages and Solutions**

   | Error | Cause | Solution |
   |-------|-------|----------|
   | "No authorization header" | Not logged in | Sign in first |
   | "Unauthorized" | Session expired | Log out and log back in |
   | "Stripe configuration error" | Missing STRIPE_SECRET_KEY | Configure in Supabase Dashboard |
   | "Configuration error" | Missing Supabase env vars | Check Supabase project settings |
   | "Price ID is required" | Frontend config issue | Check VITE_STRIPE_PRICE_* variables |
   | Network error | Connection issue | Check internet, try again |

### Testing Locally

To test the Stripe integration locally:

1. Make sure your `.env` file has all required variables
2. Start the dev server: `npm run dev`
3. Sign in to the application
4. Navigate to the Pricing page
5. Open browser console (F12) to see detailed logs
6. Click a subscription button
7. Watch console for `[Stripe API]` and `[Pricing]` logs

### Stripe Test Mode

When testing, use Stripe test mode:
- Test card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC
- Any valid billing ZIP code

### Production Checklist

Before going live:
- [ ] Switch Stripe keys from test mode to live mode
- [ ] Update STRIPE_SECRET_KEY in Supabase to live key
- [ ] Update VITE_STRIPE_PRICE_* variables to live price IDs
- [ ] Set FRONTEND_URL to production domain
- [ ] Test checkout flow end-to-end in production
- [ ] Verify webhook is configured in Stripe Dashboard
- [ ] Test subscription cancellation and updates

## Getting Help

If issues persist:
1. Check Supabase Edge Function logs for detailed errors
2. Review browser console logs for client-side issues
3. Verify all environment variables are set correctly
4. Test with Stripe's test cards in test mode
5. Contact support with error logs and screenshots
