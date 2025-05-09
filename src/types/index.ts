// ===============================
// ✅ Global Type Definitions
// ===============================

// Represents a single Todo item
export type Todo = {
  id: string;                     // Supabase UUID
  title: string;                 // Task title (required)
  description?: string;          // Optional task details
  is_completed: boolean;         // Completion status
  created_at: string;            // ISO timestamp
  user_id: string;               // Owner's ID (from Supabase Auth)
  project_id: string;            // Associated project ID (required)
  due_date?: string | null;      // Optional due date (ISO format or null)
};

// Represents a Todo project/group
export type TodoProject = {
  id: string;                    // Project UUID
  name: string;                  // Project name
  todos?: Todo[];                // Optional - lazy-loaded list of todos
  color?: string;                // Optional - UI badge color
};

// Represents the authenticated user
export type User = {
  id: string;                    // Supabase user ID
  email: string;                 // User email
  avatar_url?: string | null;   // Optional avatar
};
