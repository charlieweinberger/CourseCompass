// src/hooks/useSupabaseAuth.ts
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { createClient, User } from "@supabase/supabase-js";
import { Database } from "@/utils/databaseTypes";

// Create a fresh supabase client for every request
export function createSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Type for our combined user data
interface SupabaseUserData extends Omit<User, 'created_at' | 'updated_at'> {
  auth0_id?: string;
  name?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useSupabaseAuth() {
  const { user, isLoading: isAuth0Loading } = useUser();
  const [supabaseClient] = useState(createSupabaseClient());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUserData | null>(null);
  const [tokenResponse, setTokenResponse] = useState<any>(null);

  useEffect(() => {
    async function syncWithSupabase() {
      if (!user || isAuth0Loading) {
        setIsLoading(false);
        return;
      }

      try {
        // Exchange Auth0 token for Supabase token
        console.log("Fetching Supabase token for Auth0 user:", user.email);
        const response = await fetch('/api/auth/supabase-token');
        
        // Store the raw response for debugging
        const responseText = await response.text();
        console.log("Supabase token response status:", response.status);
        console.log("Supabase token response:", responseText);
        
        let responseData;
        try {
          responseData = JSON.parse(responseText);
          setTokenResponse(responseData);
        } catch (e) {
          console.error("Failed to parse token response:", e);
          throw new Error("Invalid response from token endpoint: " + responseText);
        }
        
        if (!response.ok) {
          throw new Error(responseData.error || 'Failed to get Supabase token');
        }
        
        const { access_token, refresh_token, expires_at } = responseData;
        
        if (!access_token) {
          throw new Error('No token received from Supabase');
        }
        
        console.log("Successfully received Supabase token");
        
        // Set the Supabase session with proper types
        console.log("Setting Supabase session");
        const { error: sessionError } = await supabaseClient.auth.setSession({
          access_token,
          refresh_token: refresh_token || '',
          // Convert expires_at to a Date if it exists
          ...(expires_at ? { expires_at: new Date(expires_at * 1000) } : {})
        });
        
        if (sessionError) {
          console.error("Error setting Supabase session:", sessionError);
          throw sessionError;
        }
        
        console.log("Successfully set Supabase session");
        
        // Check if authentication was successful
        console.log("Getting Supabase session");
        const { data } = await supabaseClient.auth.getSession();
        console.log("Supabase session:", data.session ? "exists" : "null");
        
        const authUser = data.session?.user;
        
        setIsAuthenticated(!!data.session);
        if (authUser) {
          console.log("Setting Supabase user from auth");
          setSupabaseUser(authUser as SupabaseUserData);

          // Fetch user data from the users table
          console.log("Fetching user data from users table");
          const { data: userData, error: userError } = await supabaseClient
            .from('users')
            .select('*')
            .eq('auth0_id', user.sub)
            .single();
              
          if (userError) {
            console.warn("Error fetching user data:", userError);
            if (userError.code !== 'PGRST116') {
              // If it's not just a "not found" error, log it as a warning
              console.warn("Non-critical error fetching user data:", userError);
            }
          } else if (userData) {
            // Merge the user data with the auth user
            console.log("Merging user data from users table");
            setSupabaseUser({
              ...authUser,
              ...userData
            } as unknown as SupabaseUserData);
          }
        } else {
          console.error("No Supabase user after setting session");
        }
      } catch (err) {
        console.error("Error syncing with Supabase:", err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setIsAuthenticated(false);
        setSupabaseUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    syncWithSupabase();
  }, [user, isAuth0Loading, supabaseClient]);

  return { 
    user, 
    supabaseUser,
    supabase: supabaseClient, 
    isLoading: isLoading || isAuth0Loading, 
    isAuthenticated,
    error,
    tokenResponse // Include for debugging
  };
}
