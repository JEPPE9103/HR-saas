import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Typade databastabeller
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          country: string
          plan: 'free' | 'team' | 'enterprise'
          stripe_customer_id: string | null
          created_at: string
          created_by: string
          members: string[]
        }
        Insert: {
          id?: string
          name: string
          country: string
          plan?: 'free' | 'team' | 'enterprise'
          stripe_customer_id?: string | null
          created_at?: string
          created_by: string
          members?: string[]
        }
        Update: {
          id?: string
          name?: string
          country?: string
          plan?: 'free' | 'team' | 'enterprise'
          stripe_customer_id?: string | null
          created_at?: string
          created_by?: string
          members?: string[]
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'owner' | 'admin' | 'member'
          company_id: string
          created_at: string
          last_login_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          role?: 'owner' | 'admin' | 'member'
          company_id: string
          created_at?: string
          last_login_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'owner' | 'admin' | 'member'
          company_id?: string
          created_at?: string
          last_login_at?: string
        }
      }
      datasets: {
        Row: {
          id: string
          company_id: string
          label: string
          row_count: number
          status: 'processing' | 'ready' | 'error'
          created_at: string
          created_by: string
          source: 'upload' | 'demo' | 'integration'
        }
        Insert: {
          id?: string
          company_id: string
          label: string
          row_count?: number
          status?: 'processing' | 'ready' | 'error'
          created_at?: string
          created_by: string
          source?: 'upload' | 'demo' | 'integration'
        }
        Update: {
          id?: string
          company_id?: string
          label?: string
          row_count?: number
          status?: 'processing' | 'ready' | 'error'
          created_at?: string
          created_by?: string
          source?: 'upload' | 'demo' | 'integration'
        }
      }
      subscriptions: {
        Row: {
          id: string
          company_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          plan: 'free' | 'team' | 'enterprise'
          status: 'active' | 'canceled' | 'past_due'
          current_period_start: string
          current_period_end: string
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          plan: 'free' | 'team' | 'enterprise'
          status?: 'active' | 'canceled' | 'past_due'
          current_period_start: string
          current_period_end: string
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          stripe_subscription_id?: string
          stripe_customer_id?: string
          plan?: 'free' | 'team' | 'enterprise'
          status?: 'active' | 'canceled' | 'past_due'
          current_period_start?: string
          current_period_end?: string
          created_at?: string
        }
      }
    }
  }
}
