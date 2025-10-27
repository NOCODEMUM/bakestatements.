import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          trial_end_date: string | null
          created_at: string | null
          business_name: string | null
          phone_number: string | null
          abn: string | null
          subscription_status: string | null
          stripe_customer_id: string | null
          subscription_id: string | null
          subscription_tier: string | null
          subscription_end_date: string | null
          payment_method: string | null
          full_name: string | null
        }
        Insert: {
          id: string
          email: string
          trial_end_date?: string | null
          created_at?: string | null
          business_name?: string | null
          phone_number?: string | null
          abn?: string | null
          subscription_status?: string | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
          subscription_tier?: string | null
          subscription_end_date?: string | null
          payment_method?: string | null
          full_name?: string | null
        }
        Update: {
          id?: string
          email?: string
          trial_end_date?: string | null
          created_at?: string | null
          business_name?: string | null
          phone_number?: string | null
          abn?: string | null
          subscription_status?: string | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
          subscription_tier?: string | null
          subscription_end_date?: string | null
          payment_method?: string | null
          full_name?: string | null
        }
      }
      mailing_list: {
        Row: {
          id: string
          email: string
          created_at: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string | null
        }
      }
      expenses: {
        Row: {
          id: string
          date: string
          description: string
          amount: number
          category: string
          user_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          date?: string
          description: string
          amount: number
          category: string
          user_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          date?: string
          description?: string
          amount?: number
          category?: string
          user_id?: string
          created_at?: string | null
        }
      }
      recipes: {
        Row: {
          id: string
          name: string
          batch_size: number | null
          user_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          batch_size?: number | null
          user_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          batch_size?: number | null
          user_id?: string
          created_at?: string | null
        }
      }
      ingredients: {
        Row: {
          id: string
          name: string
          cost_per_unit: number
          unit_type: string
          user_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          cost_per_unit: number
          unit_type?: string
          user_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          cost_per_unit?: number
          unit_type?: string
          user_id?: string
          created_at?: string | null
        }
      }
      recipe_ingredients: {
        Row: {
          id: string
          recipe_id: string
          ingredient_id: string
          quantity: number
          created_at: string | null
        }
        Insert: {
          id?: string
          recipe_id: string
          ingredient_id: string
          quantity: number
          created_at?: string | null
        }
        Update: {
          id?: string
          recipe_id?: string
          ingredient_id?: string
          quantity?: number
          created_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          order_details: string
          due_date: string
          status: string | null
          amount: number | null
          user_id: string
          created_at: string | null
        }
        Insert: {
          id?: string
          customer_name: string
          order_details: string
          due_date: string
          status?: string | null
          amount?: number | null
          user_id: string
          created_at?: string | null
        }
        Update: {
          id?: string
          customer_name?: string
          order_details?: string
          due_date?: string
          status?: string | null
          amount?: number | null
          user_id?: string
          created_at?: string | null
        }
      }
      enquiries: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          status: string | null
          user_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          status?: string | null
          user_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          status?: string | null
          user_id?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_status_enum: 'trial' | 'active' | 'cancelled' | 'expired' | 'lifetime'
      subscription_tier_enum: 'monthly' | 'annual' | 'lifetime'
    }
  }
}
