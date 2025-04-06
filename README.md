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
- AI: Gemini API, Letta AI, LangChain

## To Do

1. Get Auth0 working w/ Supabase
2. Allow users to upload documents
3. Parse documents w/ RAG
4. Create study plan
   a. Determine when to study topics (spaced repetition?)
   b. Find study resources online
5. Send notifications (text/email/calendar)
6. Add competition against friends