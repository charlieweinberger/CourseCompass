// src/hooks/useSupabaseAuth.ts
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export function useSupabaseAuth() {
  const { user, isLoading: isAuth0Loading } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function syncUserWithSupabase() {
      if (!user || isAuth0Loading) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user exists in Supabase
        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("auth0_id", user.sub)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 means no rows returned, which is fine for new users
          throw fetchError;
        }

        if (!existingUser) {
          // User doesn't exist in Supabase, create them
          const { error: insertError } = await supabase.from("users").insert({
            auth0_id: user.sub!,
            email: user.email!,
            name: user.name || null,
            updated_at: new Date().toISOString(),
          });

          if (insertError) throw insertError;
        } else {
          // User exists, update their info
          const { error: updateError } = await supabase
            .from("users")
            .update({
              email: user.email!,
              name: user.name || null,
              updated_at: new Date().toISOString(),
            })
            .eq("auth0_id", user.sub);

          if (updateError) throw updateError;
        }
      } catch (err) {
        console.error("Error syncing user with Supabase:", err);
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    }

    syncUserWithSupabase();
  }, [user, isAuth0Loading]);

  return { user, isLoading: isLoading || isAuth0Loading, error };
}
