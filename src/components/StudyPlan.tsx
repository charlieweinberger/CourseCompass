import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

// TODO fit this in to Dashboard, test what it looks like

export default function StudyPlan({
  title,
  code,
  study_plan,
}: Course) {
  if (!study_plan) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title} Study Plan</CardTitle>
          <CardDescription>{code}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No study plan available.</p>
        </CardContent>
      </Card>
    );
  }

  // Group sessions by date
  const sessionsByDate = study_plan.sessions.reduce<
    Record<string, (typeof study_plan.sessions)[0][]>
  >((acc, session) => {
    if (!acc[session.date]) {
      acc[session.date] = [];
    }
    acc[session.date].push(session);
    return acc;
  }, {});

  const priorityColors = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };

  const priorityIcons = {
    high: <AlertTriangle className="h-3 w-3" />,
    medium: <Clock className="h-3 w-3" />,
    low: <BookOpen className="h-3 w-3" />,
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title} Study Plan</CardTitle>
        <CardDescription>{code}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.keys(sessionsByDate).map((date) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-compass-blue" />
                <h3 className="font-medium text-2xl tracking-tight leading-tight">
                  {date}
                </h3>
              </div>

              <div className="space-y-3 pl-6">
                {sessionsByDate[date].map((session: Session) => (
                  <div
                    key={session.id}
                    className={`p-4 border rounded-lg ${
                      session.completed
                        ? "bg-gray-50 border-gray-200"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={`font-medium tracking-tight ${
                              session.completed
                                ? "text-gray-500 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            {session.title}
                          </h4>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                              priorityColors[session.priority]
                            }`}
                          >
                            {priorityIcons[session.priority]}
                            {session.priority}
                          </span>
                        </div>
                        <p
                          className={`text-sm ${
                            session.completed
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {session.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{session.duration} minutes</span>
                        </div>
                      </div>
                      <div>
                        <Button
                          variant={session.completed ? "outline" : "default"}
                          size="sm"
                          className={
                            session.completed
                              ? "border-green-200 text-green-600"
                              : "bg-compass-blue hover:bg-compass-blue-dark"
                          }
                        >
                          {session.completed ? (
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                          ) : null}
                          {session.completed ? "Completed" : "Mark Complete"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-gray-500">
          {study_plan.sessions.filter((s: Session) => s.completed).length} of{" "}
          {study_plan.sessions.length} sessions completed
        </p>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Add to Calendar
        </Button>
      </CardFooter>
    </Card>
  );
}
