import { Router } from 'express';
import * as stripeController from '../controllers/stripeController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/create-checkout', authenticate, stripeController.createCheckoutSession);
router.post('/webhook', stripeController.handleWebhook);
router.get('/subscription-status', authenticate, stripeController.getSubscriptionStatus);

export default router;
