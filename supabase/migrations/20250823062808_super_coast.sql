```sql
            CREATE TABLE public.payment_settings (
              id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id text UNIQUE NOT NULL, -- Firebase UID
              business_name text,
              abn text,
              email_from text,
              reply_to text,
              bank_account_name text,
              bank_bsb text,
              bank_account_number text,
              payid text,
              stripe_payment_link text,
              website text,
              default_due_days int DEFAULT 14,
              notes_to_customer text,
              created_at timestamptz DEFAULT now(),
              updated_at timestamptz DEFAULT now()
            );

            ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

            CREATE POLICY "Users can manage their own payment settings" ON public.payment_settings
              FOR ALL USING (user_id = (current_setting('request.jwt.claims', true)::jsonb ->> 'firebase_uid'));
            ```