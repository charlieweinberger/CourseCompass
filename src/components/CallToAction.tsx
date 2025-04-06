import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const benefits = [
  "Personalized study schedules",
  "AI-curated learning resources",
  "Smart email reminders",
  "Course timeline visualization",
  "Exam preparation assistance",
];

export default function CallToAction() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-compass-blue mb-4">
                  Ready to ace your next course?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of students who are using Course Compass to
                  transform their study habits and improve their grades.
                </p>

                <ul className="space-y-3 mb-8">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-compass-blue-light mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="flex-1">
                  <Button className="w-full bg-compass-blue hover:bg-compass-blue-dark">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-compass-blue text-compass-blue hover:bg-compass-blue/5"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-gradient p-8 md:p-10 text-white flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="h-6 w-6 text-yellow-300 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg italic mb-4">
                  "Course Compass completely changed how I study. I went from
                  struggling to keep up with assignments to confidently
                  mastering course material ahead of time."
                </p>
                <p className="font-medium">
                  — Alex Johnson, Computer Science Major
                </p>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="h-6 w-6 text-yellow-300 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg italic mb-4">
                  "The AI-powered study plans are incredibly accurate. It's like
                  having a personal tutor who understands exactly what I need to
                  focus on."
                </p>
                <p className="font-medium">— Maya Patel, Biology Major</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
