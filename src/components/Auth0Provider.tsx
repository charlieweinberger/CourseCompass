"use client";

import { UserProvider } from "@auth0/nextjs-auth0/client";

interface Auth0ProviderProps {
  children: React.ReactNode;
}

export default function Auth0Provider({ children }: Auth0ProviderProps) {
  // Auth0 SDK automatically uses environment variables
  // We don't need to explicitly pass them to UserProvider
  // Unless you need custom configuration
  return <UserProvider>{children}</UserProvider>;
}
