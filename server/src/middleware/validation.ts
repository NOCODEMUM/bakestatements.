import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('business_name').optional().trim().isLength({ max: 255 }),
  validate,
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

export const orderValidation = [
  body('customer_name').trim().notEmpty().withMessage('Customer name is required'),
  body('order_details').trim().notEmpty().withMessage('Order details are required'),
  body('due_date').isISO8601().withMessage('Valid due date is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('status').optional().isIn(['Pending', 'Confirmed', 'Baking', 'Ready', 'Delivered', 'Cancelled']),
  validate,
];

export const expenseValidation = [
  body('date').isISO8601().withMessage('Valid date is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('category').isIn(['Ingredients', 'Packaging', 'Equipment', 'Utilities', 'Rent/Kitchen Hire', 'Marketing', 'Vehicle/Delivery', 'Other']).withMessage('Valid category is required'),
  validate,
];

export const recipeValidation = [
  body('name').trim().notEmpty().withMessage('Recipe name is required'),
  body('batch_size').isInt({ min: 1 }).withMessage('Batch size must be at least 1'),
  validate,
];

export const ingredientValidation = [
  body('name').trim().notEmpty().withMessage('Ingredient name is required'),
  body('cost_per_unit').isFloat({ min: 0 }).withMessage('Cost per unit must be a positive number'),
  body('unit_type').trim().notEmpty().withMessage('Unit type is required'),
  validate,
];
