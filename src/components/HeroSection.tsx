import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, BookOpenCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="bg-gradient absolute inset-0 z-0"></div>
      <div className="container relative z-10 py-16 md:py-24 lg:py-32 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>Now with AI-powered study plans</span>
            </div>

            <h1 className="font-bold tracking-tight text-4xl lg:text-5xl">
              Master Your Courses with <br />
              <span className="text-compass-light">Course Compass</span>
            </h1>

            <p className="text-lg text-white/90 md:text-xl">
              Upload your syllabus and let AI create a personalized study plan,
              find resources, and help you stay on track throughout your
              semester.
            </p>

            <div className="pt-4">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-compass-blue hover:bg-compass-light"
                >
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden md:block relative animate-fade-up">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-compass-light to-compass-accent rounded-xl blur opacity-30"></div>
              <div className="relative bg-white p-6 rounded-md shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-compass-blue rounded-full p-2">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 font-medium tracking-tight mb-1">
                        Upload Your Syllabus
                      </h4>
                      <div className="h-2 bg-gray-200 rounded-full w-full">
                        <div className="h-2 bg-compass-blue rounded-full w-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-compass-blue-light rounded-full p-2">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 font-medium tracking-tight mb-1">
                        Generate Study Plan
                      </h4>
                      <div className="h-2 bg-gray-200 rounded-full w-full">
                        <div className="h-2 bg-compass-blue-light rounded-full w-3/4"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-compass-accent rounded-full p-2">
                      <BookOpenCheck className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900 font-medium tracking-tight mb-1">
                        Find Resources
                      </h4>
                      <div className="h-2 bg-gray-200 rounded-full w-full">
                        <div className="h-2 bg-compass-accent rounded-full w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
