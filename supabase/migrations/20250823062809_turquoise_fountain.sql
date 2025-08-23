```sql
            ALTER TABLE public.orders
            ADD COLUMN customer_email text,
            ADD COLUMN invoice_number text UNIQUE,
            ADD COLUMN public_token text UNIQUE,
            ADD COLUMN status text CHECK (status IN ('draft','sent','paid','void')) DEFAULT 'draft';

            -- Optional: Add RLS policies for new columns if needed, or adjust existing ones.
            -- For example, if you want to ensure only the owner can see/update these fields.
            -- Ensure your existing RLS policies on 'orders' table are compatible with these new columns.
            ```