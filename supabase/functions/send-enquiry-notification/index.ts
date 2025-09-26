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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { enquiryId } = await req.json()

    if (!enquiryId) {
      throw new Error('Enquiry ID is required')
    }

    // Get enquiry details
    const { data: enquiry, error: enquiryError } = await supabase
      .from('enquiries')
      .select('*')
      .eq('id', enquiryId)
      .single()

    if (enquiryError || !enquiry) {
      throw new Error('Enquiry not found')
    }

    // Send email notification (using a hypothetical email service)
    // In a real implementation, you'd integrate with services like:
    // - Resend
    // - SendGrid
    // - AWS SES
    // - Postmark

    const emailContent = {
      to: 'hello@pix3l.com.au',
      subject: `New Enquiry from ${enquiry.name}`,
      html: `
        <h2>New Enquiry Received</h2>
        <p><strong>Name:</strong> ${enquiry.name}</p>
        <p><strong>Email:</strong> ${enquiry.email}</p>
        <p><strong>Message:</strong></p>
        <p>${enquiry.message}</p>
        <p><strong>Received:</strong> ${new Date(enquiry.created_at).toLocaleString()}</p>
        <hr>
        <p>Log in to BakeStatements to respond: <a href="https://bakestatements.com/enquiries">View Enquiries</a></p>
      `,
    }

    // For demo purposes, we'll just log the email content
    console.log('Email notification would be sent:', emailContent)

    // In production, you'd actually send the email here
    // await sendEmail(emailContent)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification sent successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error sending notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})