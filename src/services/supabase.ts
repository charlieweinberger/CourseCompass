// src/services/supabase.ts
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid";

// TODO find a way to use all of these functions

// User Functions
export async function getCurrentUser(auth0Id: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth0_id", auth0Id)
    .single();

  if (error) throw error;
  return data;
}

// Course Functions
export async function createCourse(
  userId: string,
  {
    title,
    code,
    term,
    syllabusUrl,
  }: {
    title: string;
    code: string;
    term: string;
    syllabusUrl?: string;
  }
) {
  const { data, error } = await supabase
    .from("courses")
    .insert({
      user_id: userId,
      title,
      code,
      term,
      syllabus_url: syllabusUrl || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      session_index: 0,
    })
    .select();

  if (error) throw error;
  return data[0];
}

export async function getUserCourses(userId: string): Promise<Course[]> {
  const { data, error } = await supabase
    .from("courses")
    .select(`*, course:courses(*)`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getCourseById(
  courseId: string,
  userId: string
): Promise<Course> {
  const { data, error } = await supabase
    .from("courses")
    .select(`*, course:courses(*)`)
    .eq("id", courseId)
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data;
}

// Study Plan Functions
export async function createStudyPlan(courseId: string, sessions: Session[]) {
  const { data, error } = await supabase
    .from("study_plans")
    .insert({
      course_id: courseId,
      sessions: sessions,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateStudyPlan(courseId: string, sessions: Session[]) {
  const { data, error } = await supabase
    .from("courses")
    .update({
      sessions: sessions,
      updated_at: new Date().toISOString(),
    })
    .eq("id", courseId)
    .select();

  if (error) throw error;
  return data[0];
}

export async function incrementCourse(
  courseId: string,
  session_index: number
) {
  const { data, error } = await supabase
    .from("courses")
    .update({
      session_index: session_index + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", courseId)
    .select();

  if (error) throw error;
  return data[0];
}

// File Upload Functions
export async function uploadSyllabusPDF(file: File, userId: string) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${uuidv4()}.${fileExt}`;
  const filePath = `syllabi/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("course-files")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Get public URL for the file
  const {
    data: { publicUrl },
  } = supabase.storage.from("course-files").getPublicUrl(filePath);

  return publicUrl;
}
