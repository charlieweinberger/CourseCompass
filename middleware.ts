// Using Edge Runtime for better performance with Auth0
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*']
};

export default withMiddlewareAuthRequired(async function middleware(req: NextRequest) {
  return NextResponse.next();
});
