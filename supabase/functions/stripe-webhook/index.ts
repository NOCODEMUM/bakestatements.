import Stripe from 'npm:stripe@14.25.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2024-06-20',
    })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const signature = req.headers.get('Stripe-Signature')
    const body = await req.text()
    
    if (!signature) {
      throw new Error('No Stripe signature found')
    }

    let event
    
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
      )
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err.message)
      return new Response('Webhook signature verification failed', { 
        status: 400,
        headers: corsHeaders 
      })
    }

    console.log('Processing webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        
        console.log('Checkout completed for user:', userId)
        
        if (userId) {
          // Determine subscription tier based on price
          let tier = 'monthly'
          let status = 'active'
          let endDate = null

          if (session.amount_total === 29900) { // $299 lifetime
            tier = 'lifetime'
            status = 'lifetime'
          } else if (session.amount_total === 18000) { // $180 annual  
            tier = 'annual'
            // Set end date to 1 year from now
            endDate = new Date()
            endDate.setFullYear(endDate.getFullYear() + 1)
          }

          // Update user's subscription status
          const { error } = await supabase
            .from('profiles')
            .update({
              subscription_status: status,
              subscription_tier: tier,
              stripe_customer_id: session.customer,
              subscription_id: session.subscription,
              subscription_end_date: endDate?.toISOString(),
              payment_method: 'stripe'
            })
            .eq('id', userId)
            
          if (error) {
            console.error('Error updating profile after checkout:', error)
          } else {
            console.log('Successfully updated profile for user:', userId)
          }
        }
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        console.log('Subscription updated:', subscription.id, subscription.status)
        
        let dbStatus = subscription.status
        if (subscription.status === 'active') {
          dbStatus = 'active'
        } else if (['canceled', 'incomplete_expired', 'unpaid'].includes(subscription.status)) {
          dbStatus = 'cancelled'
        }

        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_status: dbStatus,
          })
          .eq('stripe_customer_id', subscription.customer)
          
        if (error) {
          console.error('Error updating subscription status:', error)
        }
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        console.log('Subscription deleted:', subscription.id)
        
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'cancelled',
            subscription_end_date: new Date().toISOString()
          })
          .eq('stripe_customer_id', subscription.customer)
          
        if (error) {
          console.error('Error updating cancelled subscription:', error)
        }
        break
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        console.log('Payment failed for customer:', invoice.customer)
        
        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'expired',
          })
          .eq('stripe_customer_id', invoice.customer)
          
        if (error) {
          console.error('Error updating failed payment status:', error)
        }
        break
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true, event_type: event.type }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})