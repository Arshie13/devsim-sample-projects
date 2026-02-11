import { createBrowserClient, createServerClient as _createServerClient, type CookieOptions } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export async function createServerClient() {
  const cookieStore = await import('next/headers').then((mod) => mod.cookies());
  const cookies = cookieStore;

  return _createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookies.set({ name, value, ...options });
        } catch {
          // The `set` method was called from a Server Component.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookies.set({ name, value: '', ...options });
        } catch {
          // The `delete` method was called from a Server Component.
        }
      },
    },
  });
}
