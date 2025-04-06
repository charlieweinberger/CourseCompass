"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-compass-blue"
          >
            <BookOpen className="h-6 w-6" />
            <span>Course Compass</span>
          </Link>
        </div>

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-4">
          {/* TODO if user is signed in, replace these buttons with a button to the dashboard */}
          <Link href="/login">
            <Button
              variant="outline"
              className="text-compass-blue hover:text-compass-blue-dark"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-compass-blue hover:bg-compass-blue-dark">
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="p-2 sm:hidden rounded-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 py-4">
          <div className="container flex flex-col justify-center items-center gap-4">
            {/* TODO if user is signed in, replace these buttons with a button to the dashboard */}
            <Link href="/login">
              <Button variant="outline" className="w-full text-compass-blue">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="w-full bg-compass-blue hover:bg-compass-blue-dark">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
