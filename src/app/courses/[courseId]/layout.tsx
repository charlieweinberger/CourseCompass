import Link from "next/link";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  // Await params before accessing its properties
  const p = await params;
  const courseId = p.courseId;
  
  return (
    <div>
      <div className="bg-gray-100 py-4 px-6 mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/courses" className="text-blue-600 hover:underline">
            ← Back to Courses
          </Link>
          <div className="flex gap-4">
            <Link href={`/courses/${courseId}`} className="hover:underline">
              Overview
            </Link>
            <Link
              href={`/courses/${courseId}/syllabus`}
              className="hover:underline"
            >
              Syllabus
            </Link>
            <Link
              href={`/courses/${courseId}/study-plan`}
              className="hover:underline"
            >
              Study Plan
            </Link>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
