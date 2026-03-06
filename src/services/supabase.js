import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseClient

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and/or Anon Key not configured. Please update .env.local file.')
  
  // Create a mock client for development without Supabase
  supabaseClient = {
    from: (table) => ({
      select: () => ({
        order: () => ({
          data: [],
          error: null
        })
      }),
      insert: () => ({
        single: () => ({
          data: null,
          error: { message: 'Supabase not configured. Please set up .env.local file.' }
        })
      }),
      update: () => ({
        eq: () => ({
          single: () => ({
            data: null,
            error: { message: 'Supabase not configured. Please set up .env.local file.' }
          })
        })
      }),
      delete: () => ({
        eq: () => ({
          error: { message: 'Supabase not configured. Please set up .env.local file.' }
        })
      }),
      auth: {
        getSession: () => ({
          data: { session: null },
          error: null
        })
      }
    })
  }
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseClient

// Database table names
export const TABLES = {
  USERS: 'users',
  PRODUCTS: 'products',
  SALES: 'sales'
}

// Helper function to handle Supabase errors
export const handleSupabaseError = (error) => {
  if (error) {
    console.error('Supabase Error:', error)
    throw new Error(error.message || 'Database operation failed')
  }
}