import { Router } from 'express';
import * as ordersController from '../controllers/ordersController.js';
import { authenticate } from '../middleware/auth.js';
import { orderValidation } from '../middleware/validation.js';

const router = Router();

router.use(authenticate);

router.get('/', ordersController.getOrders);
router.get('/:id', ordersController.getOrder);
router.post('/', orderValidation, ordersController.createOrder);
router.put('/:id', ordersController.updateOrder);
router.delete('/:id', ordersController.deleteOrder);

export default router;
