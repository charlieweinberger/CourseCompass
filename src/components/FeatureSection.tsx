import {
  BookOpen,
  CalendarClock,
  Brain,
  FileUp,
  MailCheck,
  Lightbulb,
} from "lucide-react";

const features = [
  {
    icon: FileUp,
    title: "Easy Syllabus Upload",
    description:
      "Quickly upload your course syllabus and schedule to get started.",
  },
  {
    icon: Brain,
    title: "AI-Powered Understanding",
    description:
      "Our AI understands your course materials and learning objectives.",
  },
  {
    icon: CalendarClock,
    title: "Personalized Study Plans",
    description: "Get a custom month-long study plan tailored to your course.",
  },
  {
    icon: BookOpen,
    title: "Resource Finder",
    description:
      "Discover relevant study resources and practice problems online.",
  },
  {
    icon: MailCheck,
    title: "Smart Notifications",
    description:
      "Receive timely email reminders about upcoming study sessions.",
  },
  {
    icon: Lightbulb,
    title: "Study Tips & Insights",
    description:
      "Unlock powerful learning strategies specific to your course material.",
  },
];

export default function FeatureSection() {
  return (
    <section className="py-16 bg-white" id="features">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-semibold text-3xl lg:text-4xl tracking-tight leading-tight gradient-text mb-4">
            Features Designed for Student Success
          </h2>
          <p className="text-gray-600 text-lg">
            Course Compass provides everything you need to excel in your
            university courses, powered by advanced AI that understands your
            unique learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-compass-blue/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-compass-blue" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight leading-tight mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
