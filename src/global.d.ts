interface Session {
  id: number;
  title: string;
  description: string;
  date: string;
  duration: number;
  priority: "high" | "medium" | "low";
  completed: boolean;
};

interface Course {
  id: number;
  title: string;
  code: string;
  term: string;
  syllabus_url: string | null;
  created_at: string;
  updated_at: string;
  session_index: number;
  study_plan?: {
    sessions: Session[];
    created_at: string;
    updated_at: string;
  } | null;
};