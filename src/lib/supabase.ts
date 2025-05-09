import { createClient } from '@supabase/supabase-js';
import type { Todo, TodoProject } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 🔐 Get current user
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    console.error("Failed to get current user:", error?.message);
    throw error || new Error("No user found");
  }
  return data.user;
};

// 🔑 Auth
export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

//
// ✅ TODO OPERATIONS
//

export const getTodos = async (): Promise<Todo[]> => {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching todos:', error.message);
    throw error;
  }

  return data as Todo[];
};

export const createTodo = async (
  todo: Omit<Todo, 'id' | 'created_at' | 'user_id'>
): Promise<Todo> => {
  const user = await getCurrentUser();

  if (!todo.title || !todo.project_id) {
    throw new Error("Title and project_id are required to create a todo.");
  }

  const { data, error } = await supabase
    .from('todos')
    .insert([{ ...todo, user_id: user.id }])
    .select()
    .single();

  if (error) {
    console.error('Error creating todo:', error.message);
    throw error;
  }

  return data as Todo;
};

export const updateTodo = async (
  id: string,
  updates: Partial<Omit<Todo, 'id' | 'user_id'>>
): Promise<Todo> => {
  const { data, error } = await supabase
    .from('todos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating todo:', error.message);
    throw error;
  }

  return data as Todo;
};

export const deleteTodo = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting todo:', error.message);
    throw error;
  }
};

//
// ✅ PROJECT OPERATIONS
//

export const getProjects = async (): Promise<TodoProject[]> => {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('projects')
    .select('*, todos(*)') // ✅ includes todos
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error.message);
    throw error;
  }

  return data as TodoProject[];
};

export const createProject = async (name: string): Promise<TodoProject> => {
  const user = await getCurrentUser();

  const { data, error } = await supabase
    .from('projects')
    .insert([{ name, user_id: user.id }])
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error.message);
    throw error;
  }

  return data as TodoProject;
};

// ❌ Delete a project and optionally cascade delete its todos
export const deleteProject = async (projectId: string): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    console.error('Error deleting project:', error.message);
    throw error;
  }
};
