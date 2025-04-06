"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      `404 Error: User attempted to access non-existent route: ${pathname}`
    );
  }, [pathname]);

  return (
    <div className="h-[calc(100vh-181px)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-bold tracking-tight text-4xl mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <Link
          href="/"
          className="text-compass-blue-light hover:text-compass-blue underline"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
