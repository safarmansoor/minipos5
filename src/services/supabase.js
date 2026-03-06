import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseClient

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project') || supabaseAnonKey.includes('your_anon_public_key')) {
  console.warn('⚠️ DEMO MODE: Supabase not configured. Replace credentials in .env.local to exit demo mode.')
  
  // Create a mock client for development without Supabase
  supabaseClient = {
    from: (table) => ({
      select: () => ({
        order: () => ({
          data: [],
          error: { message: 'Demo Mode: No data available. Set up Supabase to use full features.' }
        })
      }),
      insert: () => ({
        single: () => ({
          data: null,
          error: { message: 'Demo Mode: Cannot save data. Set up Supabase to use full features.' }
        })
      }),
      update: () => ({
        eq: () => ({
          single: () => ({
            data: null,
            error: { message: 'Demo Mode: Cannot update data. Set up Supabase to use full features.' }
          })
        })
      }),
      delete: () => ({
        eq: () => ({
          error: { message: 'Demo Mode: Cannot delete data. Set up Supabase to use full features.' }
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
  console.log('✅ Connected to Supabase database')
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