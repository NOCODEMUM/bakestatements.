import { Router } from 'express';
import * as ingredientsController from '../controllers/ingredientsController.js';
import { authenticate } from '../middleware/auth.js';
import { ingredientValidation } from '../middleware/validation.js';

const router = Router();

router.use(authenticate);

router.get('/', ingredientsController.getIngredients);
router.get('/:id', ingredientsController.getIngredient);
router.post('/', ingredientValidation, ingredientsController.createIngredient);
router.put('/:id', ingredientsController.updateIngredient);
router.delete('/:id', ingredientsController.deleteIngredient);

export default router;
