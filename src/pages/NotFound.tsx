import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

export default function NotFound() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  useEffect(() => {
    console.error(
      `404 Error: User attempted to access non-existent route: ${pathname}`
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-bold tracking-tight text-4xl mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-compass-blue-light hover:text-compass-blue underline">
          Return to Home
        </a>
      </div>
    </div>
  );
}
