/*
  # Update orders table for invoice functionality

  1. New Columns
    - `customer_email` (text) - for sending invoices
    - `invoice_number` (text, unique) - human-readable invoice number
    - `public_token` (text, unique) - for public invoice access
    - `status` (text) - invoice status with check constraint

  2. Constraints
    - Unique constraints on invoice_number and public_token
    - Check constraint for status values
*/

-- Add new columns to orders table
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
    ALTER TABLE orders ADD COLUMN invoice_number text UNIQUE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'public_token'
  ) THEN
    ALTER TABLE orders ADD COLUMN public_token text UNIQUE;
  END IF;
END $$;

-- Update status column to include invoice statuses
DO $$
BEGIN
  -- Drop existing check constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'orders' AND constraint_name = 'orders_status_check'
  ) THEN
    ALTER TABLE orders DROP CONSTRAINT orders_status_check;
  END IF;
  
  -- Add new check constraint with invoice statuses
  ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status = ANY (ARRAY[
    'Inquiry'::text, 
    'Confirmed'::text, 
    'Baking'::text, 
    'Ready'::text, 
    'Delivered'::text,
    'draft'::text,
    'sent'::text,
    'paid'::text,
    'void'::text
  ]));
END $$;