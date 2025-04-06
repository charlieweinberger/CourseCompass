import { Link } from "@tanstack/react-router";
import { BookOpen, Mail, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-compass-blue" />
              <span className="font-semibold text-compass-blue">
                Course Compass
              </span>
            </Link>
            <p className="text-gray-600 mb-4">
              AI-powered study planning for university students.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-compass-blue transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-compass-blue transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-compass-blue transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:info@coursecompass.com"
                className="text-gray-500 hover:text-compass-blue transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium tracking-tight text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/features"
                  className="text-gray-600 hover:text-compass-blue transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-600 hover:text-compass-blue transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/testimonials"
                  className="text-gray-600 hover:text-compass-blue transition-colors"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  to="/changelog"
                  className="text-gray-600 hover:text-compass-blue transition-colors"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium tracking-tight text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="text-gray-600 hover:text-compass-blue transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-gray-600 hover:text-compass-blue transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-600 hover:text-compass-blue transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-compass-blue transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium tracking-tight text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-compass-blue transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-600 hover:text-compass-blue transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-600 hover:text-compass-blue transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-gray-600 hover:text-compass-blue transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © {currentYear} Course Compass. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link
              to="/privacy"
              className="text-sm text-gray-600 hover:text-compass-blue transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-600 hover:text-compass-blue transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookies"
              className="text-sm text-gray-600 hover:text-compass-blue transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
