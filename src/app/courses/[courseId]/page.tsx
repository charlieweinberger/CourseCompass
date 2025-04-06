import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { getSession } from "@auth0/nextjs-auth0";

// Define the types for the study plan
interface Session {
  id: number;
  title: string;
  description: string;
  date: string;
  duration: number;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

interface StudyPlan {
  sessions: Session[];
  recommendedLinks: string[];
  studyStrategies: string[];
}

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  // Await params before accessing its properties
  const p = await params;
  const courseId = p.courseId;
  
  try {
    // Get the session directly - getSession() accesses cookies internally
    const auth0Session = await getSession();
    
    if (!auth0Session?.user) {
      return (
        <div className="container mx-auto py-8 px-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p>Please log in to view this course.</p>
          </div>
        </div>
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get the Supabase user ID from Auth0 ID
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("auth0_id", auth0Session.user.sub)
      .single();

    if (!userData) {
      return (
        <div className="container mx-auto py-8 px-4">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p>User account not found. Please try logging out and back in.</p>
          </div>
        </div>
      );
    }

    // Get the course data
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .eq("user_id", userData.id)
      .single();

    if (courseError || !course) {
      console.error("Error fetching course:", courseError);
      return notFound();
    }

    // Get the study plan for this course
    const { data: studyPlanData, error: studyPlanError } = await supabase
      .from("study_plans")
      .select("content")
      .eq("course_id", courseId)
      .single();

    if (studyPlanError) {
      console.error("Error fetching study plan:", studyPlanError);
    }

    const studyPlan = studyPlanData?.content as StudyPlan;

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Course Information</h2>
            <p className="mb-2">
              <strong>Code:</strong> {course.code}
            </p>
            <p>
              <strong>Term:</strong> {course.term}
            </p>
          </div>
        </div>

        {studyPlan && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-6">Study Plan</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4">Study Sessions</h3>
              <div className="grid gap-4">
                {studyPlan.sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className={`p-4 rounded-lg border-l-4 ${
                      session.priority === 'high' 
                        ? 'border-red-500 bg-red-50' 
                        : session.priority === 'medium' 
                          ? 'border-yellow-500 bg-yellow-50' 
                          : 'border-green-500 bg-green-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lg">{session.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {session.duration} min
                        </span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          session.priority === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : session.priority === 'medium' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {session.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">{session.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500">Date: {session.date}</span>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={session.completed} 
                          className="mr-2 h-5 w-5"
                          readOnly
                        />
                        <span>{session.completed ? 'Completed' : 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-medium mb-4">Recommended Resources</h3>
              <ul className="list-disc pl-5 space-y-2">
                {studyPlan.recommendedLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4">Study Strategies</h3>
              <ul className="list-disc pl-5 space-y-2">
                {studyPlan.studyStrategies.map((strategy, index) => (
                  <li key={index}>{strategy}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {!studyPlan && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
              <p>No study plan found for this course.</p>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in course page:", error);
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>An error occurred while loading this course. Please try again later.</p>
          <p className="text-sm mt-2">{error instanceof Error ? error.message : String(error)}</p>
        </div>
      </div>
    );
  }
}