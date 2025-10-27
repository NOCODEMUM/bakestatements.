import { Router } from 'express';
import * as recipesController from '../controllers/recipesController.js';
import { authenticate } from '../middleware/auth.js';
import { recipeValidation } from '../middleware/validation.js';

const router = Router();

router.use(authenticate);

router.get('/', recipesController.getRecipes);
router.get('/:id', recipesController.getRecipe);
router.get('/:id/cost', recipesController.calculateRecipeCost);
router.post('/', recipeValidation, recipesController.createRecipe);
router.put('/:id', recipesController.updateRecipe);
router.delete('/:id', recipesController.deleteRecipe);

export default router;
