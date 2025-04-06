# Course Compass

A study companion that helps remind you when and what to study!

## How It Works

- User creates an account, with authentication using Auth0 and data being stored in Supabase.
- User uploads a syllabus and course schedule.
- Website uses LangChain's RAG to understand content.
- Website uses Letta AI to create a 1-month study plan.
- Website finds study resources and practice problems on the internet with Letta AI.
- Website uses Letta AI to automatically send email notifications with Resend.

## Tech Stack

- Frontend: TypeScript, Vite, React, Tailwind CSS, shadcn/ui
- Backend: TypeScript, Supabase, Auth0, Twilio/Resend
- AI: Gemini API, Letta AI

## To Do

1. Finish setting up Auth0
   1. Fix hydration issue
   2. Fix Auth not working (users can still access dashboard, even if not signed in)
2. Set up Supabase, connect it to Auth0
3. Parse uploaded documents w/ Gemini API
4. Create study plan
   a. Determine when to study topics (spaced repetition?)
   b. Find study resources online
5. Send notifications (text/email/calendar)
6. Set up .tech domain