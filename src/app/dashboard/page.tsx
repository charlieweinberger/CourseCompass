import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Upload,
  Calendar,
  FileText,
  BookOpenCheck,
  Bell,
  Settings,
  ChevronRight,
  Clock,
} from "lucide-react";

// Mock data for courses
const courses = [
  {
    id: 1,
    name: "Introduction to Computer Science",
    code: "CS101",
    progress: 65,
    nextTask: "Review Chapter 4",
    nextDate: "Tomorrow",
  },
  {
    id: 2,
    name: "Calculus II",
    code: "MATH202",
    progress: 42,
    nextTask: "Practice Integration",
    nextDate: "Today",
  },
];

export default function Dashboard() {

  // TODO if the user is not logged in, redirect to login page
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Student</p>
        </div>
        <Link href="/upload">
          <Button className="bg-compass-blue hover:bg-compass-blue-dark">
            <Upload className="mr-2 h-4 w-4" />
            Upload New Syllabus
          </Button>
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">+0 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Study Sessions
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resources Found
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+8 from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Course list */}
      <h2 className="text-xl font-semibold tracking-tight leading-tight mb-4">
        Your Courses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {courses.length > 0 ? (
          courses.map((course) => (
            <Card key={course.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{course.name}</CardTitle>
                <CardDescription>{course.code}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Course Progress
                    </span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-compass-blue rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Clock className="mr-2 h-3 w-3" />
                  <span>
                    Next: {course.nextTask} • {course.nextDate}
                  </span>
                </div>
                <div className="flex justify-between w-full">
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Plan
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Resources
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardHeader className="text-center">
              <CardTitle>No courses yet</CardTitle>
              <CardDescription>
                Upload your first syllabus to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Link href="/upload">
                <Button className="bg-compass-blue hover:bg-compass-blue-dark">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Syllabus
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick actions */}
      <h2 className="text-xl font-semibold tracking-tight leading-tight mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
          <CardHeader className="p-4 flex flex-row items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3 p-2 rounded-full bg-blue-100">
                <Upload className="h-5 w-5 text-compass-blue" />
              </div>
              <div>
                <CardTitle className="text-sm">Upload Syllabus</CardTitle>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
        </Card>
        <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
          <CardHeader className="p-4 flex flex-row items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3 p-2 rounded-full bg-green-100">
                <BookOpenCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-sm">Find Resources</CardTitle>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
        </Card>
        <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
          <CardHeader className="p-4 flex flex-row items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3 p-2 rounded-full bg-purple-100">
                <Bell className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-sm">Notifications</CardTitle>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
        </Card>
        <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
          <CardHeader className="p-4 flex flex-row items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3 p-2 rounded-full bg-orange-100">
                <Settings className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-sm">Settings</CardTitle>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
