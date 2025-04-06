'use client';

// Only import this file in client components
export const authClientConfig = {
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '',
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '',
  audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || '',
  scope: process.env.NEXT_PUBLIC_AUTH0_SCOPE || 'openid profile email',
  // Remove the window reference that causes hydration issues
  redirectUri: '/api/auth/callback',
};
