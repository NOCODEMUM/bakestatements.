import { Router } from 'express';
import * as expensesController from '../controllers/expensesController.js';
import { authenticate } from '../middleware/auth.js';
import { expenseValidation } from '../middleware/validation.js';

const router = Router();

router.use(authenticate);

router.get('/', expensesController.getExpenses);
router.get('/summary', expensesController.getExpensesSummary);
router.get('/:id', expensesController.getExpense);
router.post('/', expenseValidation, expensesController.createExpense);
router.put('/:id', expensesController.updateExpense);
router.delete('/:id', expensesController.deleteExpense);

export default router;
