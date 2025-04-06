import { NextRequest } from "next/server";
import {
  handleLogin,
  handleLogout,
  handleCallback,
  handleProfile,
  AppRouteHandlerFnContext,
} from "@auth0/nextjs-auth0";
import { validateEnv } from "@/utils/env";

// Validate environment variables
const env = validateEnv();

export async function GET(
  req: NextRequest,
  ctx: AppRouteHandlerFnContext
): Promise<Response> {
  const { params } = ctx;

  // Extract the auth0 path parameter
  const a = await params;
  const auth0Param = a.auth0;

  try {
    switch (auth0Param) {
      case "login":
        return await handleLogin(req, ctx, {
          returnTo: "/dashboard",
          authorizationParams: {
            audience: env.auth0.audience,
            scope: env.auth0.scope,
          }
        });

      case "callback":
        return await handleCallback(req, ctx, {
          redirectUri: `${env.auth0.baseUrl}/api/auth/callback`
        });

      case "logout":
        return await handleLogout(req, ctx, {
          returnTo: "/",
        });

      case "me":
        return await handleProfile(req, ctx);

      default:
        return new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
    }
  } catch (error: unknown) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
