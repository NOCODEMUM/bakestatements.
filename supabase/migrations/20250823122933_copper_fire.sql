/*
  # Update orders table for invoice functionality

  1. New Columns
    - `customer_email` (text, optional) - for sending invoices
    - `invoice_number` (text, unique, optional) - generated invoice number
    - `public_token` (text, unique, optional) - for public invoice access
    - Update `status` column to include invoice statuses

  2. Constraints
    - Add unique constraints for invoice_number and public_token
    - Update status check constraint to include invoice statuses

  3. Security
    - Existing RLS policies will continue to work
*/

-- Add new columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'customer_email'
  ) THEN
    ALTER TABLE orders ADD COLUMN customer_email text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'invoice_number'
  ) THEN
    ALTER TABLE orders ADD COLUMN invoice_number text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'public_token'
  ) THEN
    ALTER TABLE orders ADD COLUMN public_token text;
  END IF;
END $$;

-- Add unique constraints if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'orders' AND constraint_name = 'orders_invoice_number_key'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_invoice_number_key UNIQUE (invoice_number);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'orders' AND constraint_name = 'orders_public_token_key'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_public_token_key UNIQUE (public_token);
  END IF;
END $$;

-- Drop existing status check constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'orders' AND constraint_name = 'orders_status_check'
  ) THEN
    ALTER TABLE orders DROP CONSTRAINT orders_status_check;
  END IF;
END $$;

-- Add updated status check constraint
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('Inquiry', 'Confirmed', 'Baking', 'Ready', 'Delivered', 'draft', 'sent', 'paid', 'void'));