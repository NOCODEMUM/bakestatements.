import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { query } from '../config/database.js';

export const getIngredients = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM ingredients WHERE user_id = $1 ORDER BY name ASC',
      [req.user!.userId]
    );

    res.json({ ingredients: result.rows });
  } catch (error) {
    console.error('Get ingredients error:', error);
    res.status(500).json({ error: 'Failed to fetch ingredients' });
  }
};

export const getIngredient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM ingredients WHERE id = $1 AND user_id = $2',
      [id, req.user!.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    res.json({ ingredient: result.rows[0] });
  } catch (error) {
    console.error('Get ingredient error:', error);
    res.status(500).json({ error: 'Failed to fetch ingredient' });
  }
};

export const createIngredient = async (req: AuthRequest, res: Response) => {
  try {
    const { name, cost_per_unit, unit_type, supplier, notes } = req.body;

    const result = await query(
      `INSERT INTO ingredients (user_id, name, cost_per_unit, unit_type, supplier, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user!.userId, name, cost_per_unit, unit_type, supplier || null, notes || null]
    );

    res.status(201).json({ ingredient: result.rows[0] });
  } catch (error) {
    console.error('Create ingredient error:', error);
    res.status(500).json({ error: 'Failed to create ingredient' });
  }
};

export const updateIngredient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, cost_per_unit, unit_type, supplier, notes } = req.body;

    const result = await query(
      `UPDATE ingredients
       SET name = COALESCE($1, name),
           cost_per_unit = COALESCE($2, cost_per_unit),
           unit_type = COALESCE($3, unit_type),
           supplier = COALESCE($4, supplier),
           notes = COALESCE($5, notes)
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [name, cost_per_unit, unit_type, supplier, notes, id, req.user!.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    res.json({ ingredient: result.rows[0] });
  } catch (error) {
    console.error('Update ingredient error:', error);
    res.status(500).json({ error: 'Failed to update ingredient' });
  }
};

export const deleteIngredient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM ingredients WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user!.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }

    res.json({ message: 'Ingredient deleted successfully' });
  } catch (error) {
    console.error('Delete ingredient error:', error);
    res.status(500).json({ error: 'Failed to delete ingredient' });
  }
};
