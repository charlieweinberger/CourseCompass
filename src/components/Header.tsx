import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-compass-blue"
          >
            <BookOpen className="h-6 w-6" />
            <span>Course Compass</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-compass-blue transition-colors"
          >
            Home
          </Link>
          <Link
            to="/features"
            className="text-sm font-medium text-gray-700 hover:text-compass-blue transition-colors"
          >
            Features
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-gray-700 hover:text-compass-blue transition-colors"
          >
            About
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login">
            <Button
              variant="outline"
              className="text-compass-blue hover:text-compass-blue-dark"
            >
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-compass-blue hover:bg-compass-blue-dark">
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="p-2 md:hidden rounded-md"
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
          <div className="container space-y-4">
            <Link
              to="/"
              className="block text-sm font-medium text-gray-700 hover:text-compass-blue"
            >
              Home
            </Link>
            <Link
              to="/features"
              className="block text-sm font-medium text-gray-700 hover:text-compass-blue"
            >
              Features
            </Link>
            <Link
              to="/about"
              className="block text-sm font-medium text-gray-700 hover:text-compass-blue"
            >
              About
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
              <Link to="/login">
                <Button variant="outline" className="w-full text-compass-blue">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="w-full bg-compass-blue hover:bg-compass-blue-dark">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
