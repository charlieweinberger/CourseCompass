import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSession } from "@auth0/nextjs-auth0";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    // Get Auth0 session
    const auth0Session = await getSession();
    
    if (!auth0Session?.user) {
      console.error("No Auth0 session found");
      return NextResponse.json(
        { error: "User not authenticated with Auth0" },
        { status: 401 }
      );
    }
    
    console.log("Auth0 user:", auth0Session.user.email);
    
    // Find the corresponding Supabase user by auth0_id
    const { data: supabaseUser, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("auth0_id", auth0Session.user.sub)
      .single();
    
    let userId: string;
    
    if (userError) {
      console.error("Error finding user by auth0_id:", userError);
      
      // If user not found, create a new user record
      console.log("Creating new user record in users table");
      const { data: newUser, error: createError } = await supabase
        .from("users")
        .insert({
          auth0_id: auth0Session.user.sub,
          email: auth0Session.user.email,
          name: auth0Session.user.name || auth0Session.user.email?.split('@')[0] || 'User'
        })
        .select("id")
        .single();
      
      if (createError) {
        console.error("Error creating user record:", createError);
        return NextResponse.json(
          { error: "Failed to create user record: " + createError.message },
          { status: 500 }
        );
      }
      
      if (!newUser) {
        console.error("Failed to create user record: no data returned");
        return NextResponse.json(
          { error: "Failed to create user record" },
          { status: 500 }
        );
      }
      
      console.log("Created new user with ID:", newUser.id);
      userId = newUser.id;
    } else {
      console.log("Found existing user with ID:", supabaseUser.id);
      userId = supabaseUser.id;
    }

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
    console.log("File content length:", fileContent.length);

    // Create a study plan
    let studyPlan;
    
    try {
      // Try using Gemini AI
      console.log("Attempting to use Gemini AI for study plan generation");
      // Use gemini-1.0-pro instead of gemini-pro
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-03-25" });
      
      const prompt = `
        Create a comprehensive study plan for the following course syllabus:
        ${fileContent.substring(0, 5000)} // Limit to 5000 chars to avoid token limits
        
        The study plan should include:
        1. A list of study sessions, each covering a specific topic or concept
        2. Recommended online study materials
        3. Study strategies specific to the course content
        
        Format the response as JSON with the following structure:
        {
          "sessions": [
            {
              "id": 1,
              "title": "Example Session",
              "description": "Example description",
              "date": "2025-04-15",
              "duration": 60,
              "priority": "high",
              "completed": false
            }
          ],
          "recommendedLinks": ["https://example.com"],
          "studyStrategies": ["Example strategy"]
        }
      `;

      const result = await model.generateContent(prompt);
      const studyPlanText = result.response.text();
      
      // Parse the JSON study plan
      try {
        studyPlan = JSON.parse(studyPlanText);
        console.log("Successfully generated study plan with Gemini AI");
      } catch (error) {
        console.error("Failed to parse study plan JSON:", error);
        
        // Attempt to extract JSON if embedded in text
        const jsonMatch = studyPlanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            studyPlan = JSON.parse(jsonMatch[0]);
            console.log("Successfully extracted JSON from Gemini response");
          } catch (error) {
            console.error("Failed to extract JSON from text:", error);
            throw new Error("Failed to parse Gemini AI response");
          }
        } else {
          throw new Error("No JSON found in Gemini AI response");
        }
      }
    } catch (error) {
      console.error("Error with Gemini AI:", error);
      
      // Fallback: Create a simple study plan without AI
      console.log("Using fallback study plan generation");
      
      // Extract course name from title or code
      const courseName = courseTitle || courseCode;
      
      // Create a generic study plan
      studyPlan = {
        sessions: [
          {
            id: 1,
            title: `Introduction to ${courseName}`,
            description: "Review course syllabus and understand course expectations",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
            duration: 60,
            priority: "high",
            completed: false
          },
          {
            id: 2,
            title: `${courseName} Core Concepts`,
            description: "Study the fundamental concepts of the course",
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks from now
            duration: 90,
            priority: "high",
            completed: false
          },
          {
            id: 3,
            title: "Midterm Preparation",
            description: "Review all materials covered so far and practice problems",
            date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 month from now
            duration: 120,
            priority: "high",
            completed: false
          }
        ],
        recommendedLinks: [
          "https://www.khanacademy.org/",
          "https://www.coursera.org/",
          "https://www.youtube.com/c/crashcourse"
        ],
        studyStrategies: [
          "Create flashcards for key terms and concepts",
          "Form a study group with classmates",
          "Schedule regular review sessions",
          "Practice with past exams if available"
        ]
      };
      
      console.log("Created fallback study plan");
    }

    // Store course information in Supabase
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .insert({
        title: courseTitle,
        code: courseCode,
        term,
        user_id: userId,
        syllabus_url: null // We'll store the content in the study plan
      })
      .select()
      .single();

    if (courseError) {
      console.error("Error saving course:", courseError);
      return NextResponse.json(
        { error: "Failed to save course: " + courseError.message },
        { status: 500 }
      );
    }

    // Store the study plan
    const { data: studyPlanData, error: studyPlanError } = await supabase
      .from("study_plans")
      .insert({
        course_id: courseData.id,
        content: studyPlan
      })
      .select()
      .single();

    if (studyPlanError) {
      console.error("Error saving study plan:", studyPlanError);
      // Delete the course since we couldn't save the study plan
      await supabase.from("courses").delete().eq("id", courseData.id);
      return NextResponse.json(
        { error: "Failed to save study plan: " + studyPlanError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      course: {
        id: courseData.id,
        title: courseData.title,
        code: courseData.code,
        term: courseData.term
      },
      studyPlan: studyPlanData.content
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
