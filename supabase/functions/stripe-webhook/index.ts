import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@14.25.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const signature = req.headers.get('Stripe-Signature')
  const body = await req.text()
  
  let event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    )
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err.message)
    return new Response('Webhook Error', { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        
        if (userId) {
          const updateData: any = {
            subscription_status: 'active',
            stripe_customer_id: session.customer,
          }

          // Handle different modes
          if (session.mode === 'subscription') {
            updateData.subscription_id = session.subscription
            updateData.subscription_tier = 'monthly' // Default, will be updated by subscription events
          } else if (session.mode === 'payment') {
            updateData.subscription_status = 'lifetime'
            updateData.subscription_tier = 'lifetime'
            updateData.subscription_id = null
          }

          const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', userId)
            
          if (error) {
            console.error('Error updating profile:', error)
          } else {
            console.log('Successfully updated profile for checkout session:', session.id)
          }
        }
        break
      }
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Determine subscription tier based on price
        let tier = 'monthly'
        if (subscription.items.data[0]?.price.recurring?.interval === 'year') {
          tier = 'annual'
        }

        const updateData: any = {
          subscription_status: subscription.status,
          subscription_tier: tier,
          subscription_id: subscription.id,
        }

        // Set end date if subscription is canceled or ended
        if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          updateData.subscription_end_date = new Date(subscription.current_period_end * 1000).toISOString()
        }

        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('stripe_customer_id', subscription.customer)
          
        if (error) {
          console.error('Error updating subscription:', error)
        } else {
          console.log('Successfully updated subscription:', subscription.id)
        }
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'cancelled',
            subscription_end_date: new Date().toISOString(),
          })
          .eq('stripe_customer_id', subscription.customer)
          
        if (error) {
          console.error('Error updating subscription deletion:', error)
        } else {
          console.log('Successfully processed subscription deletion:', subscription.id)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription) {
          // Update subscription status to active on successful payment
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'active',
            })
            .eq('stripe_customer_id', invoice.customer)
            
          if (error) {
            console.error('Error updating payment success:', error)
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription) {
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_status: 'past_due',
            })
            .eq('stripe_customer_id', invoice.customer)
            
          if (error) {
            console.error('Error updating payment failure:', error)
          }
        }
        break
      }
      
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: 'Webhook processing failed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})