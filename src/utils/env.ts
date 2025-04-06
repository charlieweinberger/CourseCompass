export function validateEnv() {
  const requiredEnvVars = [
    'AUTH0_SECRET',
    'AUTH0_BASE_URL',
    'AUTH0_ISSUER_BASE_URL',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );
  
  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
  
  return {
    auth0: {
      secret: process.env.AUTH0_SECRET!,
      baseUrl: process.env.AUTH0_BASE_URL!,
      issuerBaseUrl: process.env.AUTH0_ISSUER_BASE_URL!,
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      audience: process.env.AUTH0_AUDIENCE || '',
      scope: process.env.AUTH0_SCOPE || 'openid profile email'
    }
  };
}
