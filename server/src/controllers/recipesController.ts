import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { query } from '../config/database.js';

export const getRecipes = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM recipes WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user!.userId]
    );

    res.json({ recipes: result.rows });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

export const getRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const recipeResult = await query(
      'SELECT * FROM recipes WHERE id = $1 AND user_id = $2',
      [id, req.user!.userId]
    );

    if (recipeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const ingredientsResult = await query(
      `SELECT ri.id, ri.quantity, i.id as ingredient_id, i.name, i.cost_per_unit, i.unit_type
       FROM recipe_ingredients ri
       JOIN ingredients i ON ri.ingredient_id = i.id
       WHERE ri.recipe_id = $1`,
      [id]
    );

    const recipe = recipeResult.rows[0];
    recipe.ingredients = ingredientsResult.rows;

    res.json({ recipe });
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
};

export const createRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, batch_size, batch_unit, instructions, prep_time, bake_time, ingredients } = req.body;

    const recipeResult = await query(
      `INSERT INTO recipes (user_id, name, description, batch_size, batch_unit, instructions, prep_time, bake_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.user!.userId, name, description || null, batch_size, batch_unit || 'units', instructions || null, prep_time || null, bake_time || null]
    );

    const recipe = recipeResult.rows[0];

    if (ingredients && ingredients.length > 0) {
      for (const ing of ingredients) {
        await query(
          'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES ($1, $2, $3)',
          [recipe.id, ing.ingredient_id, ing.quantity]
        );
      }
    }

    res.status(201).json({ recipe });
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
};

export const updateRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, batch_size, batch_unit, instructions, prep_time, bake_time } = req.body;

    const result = await query(
      `UPDATE recipes
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           batch_size = COALESCE($3, batch_size),
           batch_unit = COALESCE($4, batch_unit),
           instructions = COALESCE($5, instructions),
           prep_time = COALESCE($6, prep_time),
           bake_time = COALESCE($7, bake_time)
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [name, description, batch_size, batch_unit, instructions, prep_time, bake_time, id, req.user!.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ recipe: result.rows[0] });
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
};

export const deleteRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user!.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};

export const calculateRecipeCost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const recipeResult = await query(
      'SELECT * FROM recipes WHERE id = $1 AND user_id = $2',
      [id, req.user!.userId]
    );

    if (recipeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const ingredientsResult = await query(
      `SELECT ri.quantity, i.cost_per_unit
       FROM recipe_ingredients ri
       JOIN ingredients i ON ri.ingredient_id = i.id
       WHERE ri.recipe_id = $1`,
      [id]
    );

    const totalCost = ingredientsResult.rows.reduce((sum, ing) => {
      return sum + (parseFloat(ing.quantity) * parseFloat(ing.cost_per_unit));
    }, 0);

    const recipe = recipeResult.rows[0];
    const costPerUnit = totalCost / recipe.batch_size;

    res.json({
      recipe_id: recipe.id,
      recipe_name: recipe.name,
      batch_size: recipe.batch_size,
      total_cost: totalCost,
      cost_per_unit: costPerUnit,
    });
  } catch (error) {
    console.error('Calculate recipe cost error:', error);
    res.status(500).json({ error: 'Failed to calculate recipe cost' });
  }
};
