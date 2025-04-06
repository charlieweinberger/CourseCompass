import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";

export default async function CoursesPage() {
  try {
    // Get session from Auth0
    const auth0Session = await getSession();

    if (!auth0Session?.user) {
      return (
        <div className="container mx-auto py-8 px-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p>Please log in to view your courses.</p>
          </div>
        </div>
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get the Supabase user ID from Auth0 ID
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("auth0_id", auth0Session.user.sub)
      .single();

    if (userError || !userData) {
      console.error("Error fetching user:", userError);
      return (
        <div className="container mx-auto py-8 px-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p>User account not found. Please try logging out and back in.</p>
          </div>
        </div>
      );
    }

    // Get courses for the current user
    const { data: courses, error: coursesError } = await supabase
      .from("courses")
      .select("id, title, code, term")
      .eq("user_id", userData.id);

    if (coursesError) {
      console.error("Error fetching courses:", coursesError);
      return (
        <div className="container mx-auto py-8 px-4">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>
              An error occurred while loading your courses. Please try again
              later.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Courses</h1>
          <Link
            href="/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Add New Course
          </Link>
        </div>

        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                href={`/courses/${course.id}`}
                key={course.id}
                className="block"
              >
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <p className="text-gray-600">{course.code}</p>
                  <p className="text-gray-500">{course.term}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-medium mb-4">
              You don&apos;t have any courses yet
            </h2>
            <p className="text-gray-600 mb-6">
              Get started by adding your first course and uploading a syllabus.
            </p>
            <Link
              href="/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded inline-block"
            >
              Add Your First Course
            </Link>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in courses page:", error);
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>
            An error occurred while loading your courses. Please try again
            later.
          </p>
          <p className="text-sm mt-2">
            {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      </div>
    );
  }
}
