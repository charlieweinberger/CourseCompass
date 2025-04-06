import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import UploadForm from "@/components/UploadForm";

export default function Upload() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-compass-blue hover:text-compass-blue-dark"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-bold tracking-tight text-3xl mb-2">
            Upload Your Course Materials
          </h1>
          <p className="text-gray-600">
            Our AI will analyze your syllabus to create a personalized study
            plan
          </p>
        </div>

        <UploadForm />
      </div>
    </div>
  );
}
