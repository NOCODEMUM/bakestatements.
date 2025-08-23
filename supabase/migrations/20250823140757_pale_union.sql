/*
  # Drop payment_settings table

  This migration removes the payment_settings table that was used for invoicing features.
  
  1. Changes
    - Drop `payment_settings` table completely
    - Remove all associated indexes and policies
  
  2. Security
    - No security changes needed as table is being removed
*/

DROP TABLE IF EXISTS payment_settings CASCADE;