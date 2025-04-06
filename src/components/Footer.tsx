import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100">
      <div className="container p-12">

        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © {currentYear} Course Compass. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-gray-600 hover:text-compass-blue-dark transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-gray-600 hover:text-compass-blue-dark transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-600 hover:text-compass-blue-dark transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
