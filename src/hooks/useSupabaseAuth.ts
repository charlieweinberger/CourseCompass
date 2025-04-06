// src/hooks/useSupabaseAuth.ts
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Create a fresh supabase client for every request
export function createSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function useSupabaseAuth() {
  const { user, isLoading: isAuth0Loading } = useUser();
  const [supabaseClient] = useState(createSupabaseClient());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function syncWithSupabase() {
      if (!user || isAuth0Loading) {
        setIsLoading(false);
        return;
      }

      try {
        // Exchange Auth0 token for Supabase token
        const response = await fetch('/api/auth/supabase-token');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get Supabase token');
        }
        
        const { token, refresh_token } = await response.json();
        
        if (!token) {
          throw new Error('No token received from Supabase');
        }
        
        // Set the Supabase session
        const { error: sessionError } = await supabaseClient.auth.setSession({
          access_token: token,
          refresh_token: refresh_token
        });
        
        if (sessionError) {
          throw sessionError;
        }
        
        // Check if authentication was successful
        const { data: { session } } = await supabaseClient.auth.getSession();
        setIsAuthenticated(!!session);

      } catch (err) {
        console.error("Error syncing with Supabase:", err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    syncWithSupabase();
  }, [user, isAuth0Loading]);

  return { 
    user, 
    supabase: supabaseClient, 
    isLoading: isLoading || isAuth0Loading, 
    isAuthenticated,
    error 
  };
}
