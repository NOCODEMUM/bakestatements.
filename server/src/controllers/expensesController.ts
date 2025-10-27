import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { query } from '../config/database.js';

export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC',
      [req.user!.userId]
    );

    res.json({ expenses: result.rows });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};

export const getExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM expenses WHERE id = $1 AND user_id = $2',
      [id, req.user!.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ expense: result.rows[0] });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
};

export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { date, description, amount, category, receipt_url } = req.body;

    const result = await query(
      `INSERT INTO expenses (user_id, date, description, amount, category, receipt_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user!.userId, date, description, amount, category, receipt_url || null]
    );

    res.status(201).json({ expense: result.rows[0] });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
};

export const updateExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { date, description, amount, category, receipt_url } = req.body;

    const result = await query(
      `UPDATE expenses
       SET date = COALESCE($1, date),
           description = COALESCE($2, description),
           amount = COALESCE($3, amount),
           category = COALESCE($4, category),
           receipt_url = COALESCE($5, receipt_url)
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [date, description, amount, category, receipt_url, id, req.user!.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ expense: result.rows[0] });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user!.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
};

export const getExpensesSummary = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT
        category,
        COUNT(*) as count,
        SUM(amount) as total
       FROM expenses
       WHERE user_id = $1
       GROUP BY category
       ORDER BY total DESC`,
      [req.user!.userId]
    );

    res.json({ summary: result.rows });
  } catch (error) {
    console.error('Get expenses summary error:', error);
    res.status(500).json({ error: 'Failed to fetch expenses summary' });
  }
};
