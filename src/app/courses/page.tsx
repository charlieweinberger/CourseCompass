import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

export default async function CoursesPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, code, term, slug');
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Link href={`/courses/${course.id}`} key={course.id}>
            <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-600">{course.code}</p>
              <p className="text-gray-500">{course.term}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
