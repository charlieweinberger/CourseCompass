"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, isLoading } = useUser();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-compass-blue" />
          <span className="font-semibold text-xl text-compass-blue">
            Course Compass
          </span>
        </Link>

        <nav>
          <ul className="flex items-center space-x-6">
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <li>
                      <Link
                        href="/dashboard"
                        className="text-gray-700 hover:text-compass-blue"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/profile"
                        className="text-gray-700 hover:text-compass-blue"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Button size="sm" asChild>
                        <Link href="/api/auth/logout">Log Out</Link>
                      </Button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        href="/login"
                        className="text-gray-700 hover:text-compass-blue"
                      >
                        Log In
                      </Link>
                    </li>
                    <li>
                      <Button size="sm" asChild>
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
