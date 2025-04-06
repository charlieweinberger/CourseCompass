import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// TODO prompt Copilot to write code for the following:
// users sends course title, course code, term, and syllabus file
// backend creates a course in the database (Supabase)
// backend creates a study plan based on the syllabus (Gemini API)
// backend configures notifications for the user (Letta AI? Resend?)
// backend returns the study plan to the frontend

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const courseTitle = formData.get("courseTitle") as string;
    const courseCode = formData.get("courseCode") as string;
    const term = formData.get("term") as string;
    const file = formData.get("file") as File;

    if (!courseTitle || !courseCode || !term || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get file content
    const fileContent = await file.text();

    // Generate a slug for the course
    const slug = `${courseCode.replace(/\s+/g, "-").toLowerCase()}-${term
      .replace(/\s+/g, "-")
      .toLowerCase()}`;

    // Get user ID from session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Create a study plan using Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `
      Create a comprehensive study plan for the following course syllabus:
      ${fileContent}
      
      The study plan should include:
      1. A list of study sessions, each covering a specific topic or concept
      2. Recommended online study materials
      3. Study strategies specific to the course content
      
      Format the response as JSON with the following structure:
      {
        "sessions": [
          {
            id: number,
            title: string,
            description: string,
            date: string,
            duration: number,
            priority: "high" | "medium" | "low",
            completed: boolean,
          }
        ],
        "recommendedLinks": string[],
        "studyStrategies": string[]
      }
    `;

    const result = await model.generateContent(prompt);
    const studyPlanText = result.response.text();

    // Parse the JSON study plan (with error handling if Gemini returns non-JSON)
    let studyPlan;
    try {
      studyPlan = JSON.parse(studyPlanText);
    } catch (error) {
      console.error("Failed to parse study plan JSON:", error);

      // Attempt to extract JSON if embedded in text
      const jsonMatch = studyPlanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          studyPlan = JSON.parse(jsonMatch[0]);
        } catch (error) {
          console.error("Failed to extract JSON from text:", error);
          return NextResponse.json(
            { error: "Failed to generate a valid study plan" },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "Failed to generate a valid study plan" },
          { status: 500 }
        );
      }
    }

    // Store course information in Supabase
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .insert({
        title: courseTitle,
        code: courseCode,
        term,
        slug,
        user_id: userId,
        syllabus: fileContent,
        study_plan: studyPlan,
      })
      .select()
      .single();

    if (courseError) {
      console.error("Error saving course:", courseError);
      return NextResponse.json(
        { error: "Failed to save course" },
        { status: 500 }
      );
    }

    // Configure notifications (placeholder for now)
    // This would be where you'd set up notifications with Letta AI or Resend

    return NextResponse.json({
      success: true,
      course: {
        id: courseData.id,
        title: courseData.title,
        code: courseData.code,
        term: courseData.term,
        slug: courseData.slug,
      },
      studyPlan,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
