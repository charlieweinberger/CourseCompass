"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  Plus,
  FileText,
  BookOpenCheck,
  Bell,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Database } from "@/utils/databaseTypes";

// Define the Course type based on our database schema
type Course = Database['public']['Tables']['courses']['Row'] & {
  study_plan?: {
    sessions?: Array<{
      title: string;
      date: string;
      completed: boolean;
    }>;
  }
};

export default function DashboardPage() {
  const { user, isLoading: isAuth0Loading } = useUser();
  const { 
    supabase, 
    supabaseUser,
    isLoading: isSupabaseLoading, 
    isAuthenticated, 
    error: supabaseError,
    tokenResponse
  } = useSupabaseAuth();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses when Supabase authentication is ready
  useEffect(() => {
    async function fetchCourses() {
      if (!isAuthenticated || !supabaseUser) return;
      
      setIsLoadingCourses(true);
      setError(null);
      
      try {
        // Query courses for the current authenticated user using auth0_id
        const { data, error: fetchError } = await supabase
          .from("courses")
          .select("*")
          .eq("user_id", supabaseUser.id);
          
        if (fetchError) {
          throw fetchError;
        }
        
        setCourses(data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses");
      } finally {
        setIsLoadingCourses(false);
      }
    }
    
    fetchCourses();
  }, [isAuthenticated, supabase, supabaseUser]);

  if (isAuth0Loading || isSupabaseLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-compass-blue mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] p-8">
        <p className="text-xl mb-4">Please log in to view your dashboard.</p>
        <Link href="/api/auth/login">
          <Button className="bg-compass-blue hover:bg-compass-blue-dark">
            Log In
          </Button>
        </Link>
      </div>
    );
  }
  
  if (supabaseError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] p-8">
        <div className="text-red-500 text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="mb-4">Error connecting to database: {supabaseError.message}</p>
          <p className="mb-6">Please try logging out and logging back in.</p>
          
          {/* Debug information */}
          <div className="mt-4 p-4 bg-gray-100 text-gray-800 text-left rounded text-xs overflow-auto max-h-60">
            <h3 className="font-bold mb-2">Debug Information:</h3>
            <pre>{JSON.stringify({ 
              auth0User: user ? { 
                sub: user.sub,
                email: user.email,
                name: user.name 
              } : null,
              tokenResponse: tokenResponse || 'No token response'
            }, null, 2)}</pre>
          </div>
          
          <div className="flex gap-4 justify-center mt-4">
            <Link href="/api/auth/logout">
              <Button variant="outline">Log Out</Button>
            </Link>
            <Button 
              className="bg-compass-blue hover:bg-compass-blue-dark"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated || !supabaseUser) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] p-8">
        <div className="text-red-500 text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
          <p className="mb-4">Not authenticated with the database.</p>
          <p className="mb-6">Please try logging out and logging back in.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/api/auth/logout">
              <Button variant="outline">Log Out</Button>
            </Link>
            <Button 
              className="bg-compass-blue hover:bg-compass-blue-dark"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {supabaseUser.name || user.name || 'Student'}!</p>
        </div>
        <Link href="/new">
          <Button className="bg-compass-blue hover:bg-compass-blue-dark">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>
      {/* Course list */}
      <h2 className="text-xl font-semibold tracking-tight leading-tight mb-4">
        Your Courses
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {isLoadingCourses ? (
          <Card className="col-span-full p-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-compass-blue"></div>
            </div>
          </Card>
        ) : error ? (
          <Card className="col-span-full p-8">
            <div className="text-red-500 text-center">{error}</div>
          </Card>
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <Card key={course.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>{course.code}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Term:</span>
                    <span>{course.term}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Created:</span>
                    <span>{new Date(course.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/courses/${course.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Course
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No courses yet</CardTitle>
              <CardDescription>
                Create your first course to get started with your study plan
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/new" className="w-full">
                <Button className="w-full bg-compass-blue hover:bg-compass-blue-dark">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Course
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Quick actions */}
      <h2 className="text-xl font-semibold tracking-tight leading-tight mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link href="/new">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
            <CardHeader className="p-4 flex flex-row items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3 p-2 rounded-full bg-blue-100">
                  <Plus className="h-5 w-5 text-compass-blue" />
                </div>
                <div>
                  <CardTitle className="text-sm">Create New Course</CardTitle>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
          </Card>
        </Link>
        <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
          <CardHeader className="p-4 flex flex-row items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3 p-2 rounded-full bg-indigo-100">
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
      </div>

      {/* Quick stats */}
      <h2 className="text-xl font-semibold tracking-tight leading-tight mb-4">
        Course Stats
      </h2>
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
            <div className="text-2xl font-bold">
              {courses.reduce((total, course) => {
                return total + (course.study_plan?.sessions?.length || 0);
              }, 0)}
            </div>
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
    </div>
  );
}
