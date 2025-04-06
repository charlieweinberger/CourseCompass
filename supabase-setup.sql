-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth0_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  term TEXT NOT NULL,
  syllabus_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create study_plans table
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id),
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for courses table
CREATE POLICY "Users can read their own courses" ON public.courses
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert their own courses" ON public.courses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update their own courses" ON public.courses
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete their own courses" ON public.courses
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for study_plans table
CREATE POLICY "Users can read their own study plans" ON public.study_plans
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.courses WHERE id = course_id
    )
  );
  
CREATE POLICY "Users can insert their own study plans" ON public.study_plans
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.courses WHERE id = course_id
    )
  );
  
CREATE POLICY "Users can update their own study plans" ON public.study_plans
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.courses WHERE id = course_id
    )
  );
  
CREATE POLICY "Users can delete their own study plans" ON public.study_plans
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.courses WHERE id = course_id
    )
  );

-- Create function to execute SQL (if needed)
CREATE OR REPLACE FUNCTION exec_sql(sql text) RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
