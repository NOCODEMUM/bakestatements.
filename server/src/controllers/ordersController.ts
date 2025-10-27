import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { query } from '../config/database.js';

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY due_date ASC',
      [req.user!.userId]
    );

    res.json({ orders: result.rows });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, req.user!.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order: result.rows[0] });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { customer_name, customer_email, customer_phone, order_details, due_date, status, amount, notes } = req.body;

    const result = await query(
      `INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, order_details, due_date, status, amount, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [req.user!.userId, customer_name, customer_email || null, customer_phone || null, order_details, due_date, status || 'Pending', amount, notes || null]
    );

    res.status(201).json({ order: result.rows[0] });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const updateOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { customer_name, customer_email, customer_phone, order_details, due_date, status, amount, notes } = req.body;

    const result = await query(
      `UPDATE orders
       SET customer_name = COALESCE($1, customer_name),
           customer_email = COALESCE($2, customer_email),
           customer_phone = COALESCE($3, customer_phone),
           order_details = COALESCE($4, order_details),
           due_date = COALESCE($5, due_date),
           status = COALESCE($6, status),
           amount = COALESCE($7, amount),
           notes = COALESCE($8, notes)
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [customer_name, customer_email, customer_phone, order_details, due_date, status, amount, notes, id, req.user!.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order: result.rows[0] });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

export const deleteOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM orders WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user!.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};
