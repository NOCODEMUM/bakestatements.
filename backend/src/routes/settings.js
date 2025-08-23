import express from 'express';
import { supabase } from '../lib/supabase.js';
import { verifyFirebaseToken } from '../lib/firebase-admin.js';

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

// GET /api/settings/get
router.get('/get', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payment_settings')
      .select('*')
      .eq('user_id', req.user.uid)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    res.json({ data: data || null });
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    res.status(500).json({ error: 'Failed to fetch payment settings' });
  }
});

// POST /api/settings/save
router.post('/save', authenticateUser, async (req, res) => {
  try {
    const settingsData = {
      ...req.body,
      user_id: req.user.uid,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('payment_settings')
      .upsert(settingsData, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;

    res.json({ data });
  } catch (error) {
    console.error('Error saving payment settings:', error);
    res.status(500).json({ error: 'Failed to save payment settings' });
  }
});

export default router;