import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const courseId = params.courseId;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Course Information</h2>
          <p>
            <strong>Code:</strong> {course.code}
          </p>
          <p>
            <strong>Term:</strong> {course.term}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Study Plan</h2>
          {course.study_plan?.sessions?.map((session: Session) => (
            <div key={session.date} className="mb-4">
              <h3 className="font-medium">
                {session.date}: {session.title}
              </h3>
              <p className="text-gray-600">{session.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}