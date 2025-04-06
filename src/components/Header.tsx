"use client";

import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, isLoading } = useUser();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-compass-blue" />
          <span className="font-semibold text-xl text-compass-blue">
            Course Compass
          </span>
        </Link>

        <nav>
          <ul className="flex items-center gap-4">
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <li>
                      <Link href="/dashboard">
                        <Button className="bg-compass-blue hover:bg-compass-blue-dark">
                          Dashboard
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile">
                        <Button variant="outline" className="hover:text-gray-100 hover:bg-compass-blue">
                          Profile
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link href="/api/auth/logout">
                        <Button variant="outline" className="hover:text-gray-100 hover:bg-compass-blue">
                          Log Out
                        </Button>
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/login">
                        <Button variant="outline" className="hover:text-gray-100 hover:bg-compass-blue">
                          Log In
                        </Button>
                      </Link>
                    </li>
                    <li>
                      <Link href="/signup">
                        <Button className="bg-compass-blue hover:bg-compass-blue-dark">
                          Sign Up
                        </Button>
                      </Link>
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
