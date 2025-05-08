
import { createClient } from '@supabase/supabase-js';
import type { Todo } from '@/types';

// These values should be replaced with actual environment variables when deployed
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getTodos = async () => {
  const { data: todos, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }

  return todos as Todo[];
};

export const createTodo = async (todo: Omit<Todo, 'id' | 'created_at' | 'user_id'>) => {
  const { data, error } = await supabase
    .from('todos')
    .insert([todo])
    .select();

  if (error) {
    console.error('Error creating todo:', error);
    throw error;
  }

  return data[0] as Todo;
};

export const updateTodo = async (id: string, todo: Partial<Omit<Todo, 'id' | 'user_id'>>) => {
  const { data, error } = await supabase
    .from('todos')
    .update(todo)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating todo:', error);
    throw error;
  }

  return data[0] as Todo;
};

export const deleteTodo = async (id: string) => {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};
