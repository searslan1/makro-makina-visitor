import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Client-side Supabase client (for browser environments)
let browserSupabaseClient: SupabaseClient | undefined

export function createBrowserClient(): SupabaseClient {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.")
  }

  if (!browserSupabaseClient) {
    browserSupabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true, // Persist session in local storage
        },
      },
    )
  }
  return browserSupabaseClient
}

// Server-side Supabase client (for API Routes, Server Actions)
let serviceSupabaseClient: SupabaseClient | undefined

export function createServiceClient(): SupabaseClient {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.")
  }

  if (!serviceSupabaseClient) {
    serviceSupabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false, // No session persistence on the server
      },
    })
  }
  return serviceSupabaseClient
}

// Example usage (for demonstration, not part of the client itself)
// import { createBrowserClient, createServiceClient } from '@/lib/supabase';
// const supabaseBrowser = createBrowserClient();
// const supabaseService = createServiceClient();
