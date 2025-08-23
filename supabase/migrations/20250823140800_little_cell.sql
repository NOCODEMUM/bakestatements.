/*
  # Revert orders table invoice columns

  This migration removes invoice-specific columns from the orders table.
  
  1. Changes
    - Remove `customer_email` column from orders table
    - Remove `invoice_number` column from orders table  
    - Remove `public_token` column from orders table
    - Revert status check constraint to original order statuses
  
  2. Security
    - No security changes needed
*/

-- Remove invoice-specific columns
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'customer_email'
  ) THEN
    ALTER TABLE orders DROP COLUMN customer_email;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'invoice_number'
  ) THEN
    ALTER TABLE orders DROP COLUMN invoice_number;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' AND column_name = 'public_token'
  ) THEN
    ALTER TABLE orders DROP COLUMN public_token;
  END IF;
END $$;

-- Drop existing status constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE constraint_name = 'orders_status_check' AND table_name = 'orders'
  ) THEN
    ALTER TABLE orders DROP CONSTRAINT orders_status_check;
  END IF;
END $$;

-- Add back original status constraint
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('Inquiry', 'Confirmed', 'Baking', 'Ready', 'Delivered'));