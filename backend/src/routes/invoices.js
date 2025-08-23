import express from 'express';
import { supabase } from '../lib/supabase.js';
import { verifyFirebaseToken } from '../lib/firebase-admin.js';
import { sendEmail, loadEmailTemplate } from '../lib/email.js';
import crypto from 'crypto';

const router = express.Router();

// Middleware to verify Firebase token
async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await verifyFirebaseToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// POST /api/invoices/send
router.post('/send', authenticateUser, async (req, res) => {
  try {
    const { invoice_id } = req.body;

    if (!invoice_id) {
      return res.status(400).json({ error: 'Invoice ID is required' });
    }

    // Get user's profile to link Firebase UID to Supabase profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('firebase_uid', req.user.uid)
      .single();

    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Fetch invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', invoice_id)
      .eq('user_id', profile.id)
      .single();

    if (invoiceError || !invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (!invoice.customer_email) {
      return res.status(400).json({ error: 'Customer email is required to send invoice' });
    }

    // Fetch payment settings
    const { data: paymentSettings } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('user_id', req.user.uid)
      .single();

    if (!paymentSettings || !paymentSettings.email_from) {
      return res.status(400).json({ error: 'Email settings not configured. Please set up your payment settings first.' });
    }

    // Generate invoice number and public token if missing
    let updateData = {};
    
    if (!invoice.invoice_number) {
      const invoiceNumber = `INV-${Date.now()}`;
      updateData.invoice_number = invoiceNumber;
    }

    if (!invoice.public_token) {
      const publicToken = crypto.randomBytes(16).toString('hex');
      updateData.public_token = publicToken;
    }

    // Update invoice with generated data
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', invoice_id);

      if (updateError) throw updateError;

      // Refetch updated invoice
      const { data: updatedInvoice } = await supabase
        .from('orders')
        .select('*')
        .eq('id', invoice_id)
        .single();

      Object.assign(invoice, updatedInvoice);
    }

    // Build public invoice URL
    const publicUrl = `${process.env.APP_URL || 'http://localhost:5173'}/invoice/${invoice.public_token}`;

    // Prepare email template variables
    const templateVars = {
      business_name: paymentSettings.business_name || 'Your Business',
      customer_name: invoice.customer_name,
      invoice_number: invoice.invoice_number,
      amount: (invoice.amount * 1.1).toFixed(2), // Include GST
      due_date: new Date(invoice.due_date).toLocaleDateString(),
      invoice_url: publicUrl,
      notes_to_customer: paymentSettings.notes_to_customer || 'Thank you for your business!',
      website: paymentSettings.website || '',
      current_year: new Date().getFullYear()
    };

    // Load and send email
    const emailHtml = loadEmailTemplate('invoice_email', templateVars);
    
    await sendEmail({
      to: invoice.customer_email,
      subject: `Invoice #${invoice.invoice_number} from ${paymentSettings.business_name}`,
      html: emailHtml,
      from: paymentSettings.email_from,
      replyTo: paymentSettings.reply_to || paymentSettings.email_from
    });

    // Update invoice status to sent
    await supabase
      .from('orders')
      .update({ status: 'sent' })
      .eq('id', invoice_id);

    res.json({ 
      success: true, 
      message: 'Invoice sent successfully',
      public_url: publicUrl 
    });

  } catch (error) {
    console.error('Error sending invoice:', error);
    res.status(500).json({ error: 'Failed to send invoice' });
  }
});

// GET /api/invoices/public
router.get('/public', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Fetch invoice by public token
    const { data: invoice, error: invoiceError } = await supabase
      .from('orders')
      .select('*')
      .eq('public_token', token)
      .single();

    if (invoiceError || !invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Get user's profile to find Firebase UID
    const { data: profile } = await supabase
      .from('profiles')
      .select('firebase_uid')
      .eq('id', invoice.user_id)
      .single();

    if (!profile) {
      return res.status(404).json({ error: 'Invoice owner not found' });
    }

    // Fetch payment settings
    const { data: paymentSettings } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('user_id', profile.firebase_uid)
      .single();

    res.json({ 
      invoice,
      payment_settings: paymentSettings || {}
    });

  } catch (error) {
    console.error('Error fetching public invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

export default router;