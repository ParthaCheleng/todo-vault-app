
export type Todo = {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
  user_id: string;
  due_date?: string;
};

export type TodoProject = {
  id: string;
  name: string;
  todos: Todo[];
  color?: string;
};

export type User = {
  id: string;
  email: string;
  avatar_url?: string;
};
