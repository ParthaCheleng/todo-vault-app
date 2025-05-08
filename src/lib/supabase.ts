
import { createClient } from '@supabase/supabase-js';
import type { Todo } from '@/types';

// For development purposes, we'll use temporary placeholders
// These should be replaced with actual environment variables when connecting to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock implementation for development without actual Supabase connection
export const getTodos = async () => {
  // Check if we're using the placeholder URL (no real Supabase connection)
  if (supabaseUrl === 'https://placeholder-project.supabase.co') {
    console.log('Using mock data - connect to Supabase for real data');
    // Return mock data for development
    return [
      {
        id: '1',
        title: 'Learn React',
        description: 'Study React hooks and context',
        is_completed: false,
        created_at: new Date().toISOString(),
        user_id: 'mock-user-id'
      },
      {
        id: '2',
        title: 'Game App: Create UI design',
        description: 'Design the main components',
        is_completed: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        user_id: 'mock-user-id'
      },
      {
        id: '3',
        title: 'Grocery Shopping',
        description: 'Buy milk, eggs, and bread',
        is_completed: false,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        user_id: 'mock-user-id',
        due_date: new Date(Date.now() + 86400000).toISOString()
      }
    ] as Todo[];
  }
  
  // Real implementation to be used when connected to Supabase
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
  // Check if we're using the placeholder URL
  if (supabaseUrl === 'https://placeholder-project.supabase.co') {
    console.log('Using mock implementation - connect to Supabase for real data');
    // Mock implementation
    const newTodo: Todo = {
      id: Math.random().toString(36).substring(2, 11),
      ...todo,
      created_at: new Date().toISOString(),
      user_id: 'mock-user-id'
    };
    
    return newTodo;
  }
  
  // Real implementation
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
  // Check if we're using the placeholder URL
  if (supabaseUrl === 'https://placeholder-project.supabase.co') {
    console.log('Using mock implementation - connect to Supabase for real data');
    // Mock implementation
    return {
      id,
      ...todo,
      created_at: new Date().toISOString(),
      user_id: 'mock-user-id',
      title: todo.title || 'Updated Task',
      is_completed: todo.is_completed !== undefined ? todo.is_completed : false
    } as Todo;
  }
  
  // Real implementation
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
  // Check if we're using the placeholder URL
  if (supabaseUrl === 'https://placeholder-project.supabase.co') {
    console.log('Using mock implementation - connect to Supabase for real data');
    // Mock implementation - just return without doing anything
    return;
  }
  
  // Real implementation
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};
