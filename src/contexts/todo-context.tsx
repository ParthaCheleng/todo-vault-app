
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';
import type { Todo, TodoProject } from '@/types';

type TodoContextType = {
  todos: Todo[];
  projects: TodoProject[];
  loading: boolean;
  addTodo: (todo: Omit<Todo, 'id' | 'created_at' | 'user_id'>) => Promise<Todo>;
  updateTodo: (id: string, todo: Partial<Omit<Todo, 'id' | 'user_id'>>) => Promise<Todo>;
  deleteTodo: (id: string) => Promise<void>;
  toggleComplete: (id: string, isCompleted: boolean) => Promise<Todo>;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [projects, setProjects] = useState<TodoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch todos when user changes
  useEffect(() => {
    const fetchTodos = async () => {
      if (!user) {
        setTodos([]);
        setProjects([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fetchedTodos = await getTodos();
        setTodos(fetchedTodos);

        // Mock projects for now - in a real app you'd fetch from Supabase
        setProjects([
          {
            id: '1',
            name: 'Game App',
            todos: fetchedTodos.filter(t => t.title.includes('Game')),
            color: '#9D6EFF'
          },
          {
            id: '2',
            name: 'Groceries',
            todos: fetchedTodos.filter(t => t.title.includes('Grocery')),
            color: '#FFD966'
          }
        ]);
      } catch (error: any) {
        toast({
          title: "Failed to fetch todos",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [user, toast]);

  const addTodo = async (todo: Omit<Todo, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const newTodo = await createTodo(todo);
      setTodos(prev => [newTodo, ...prev]);
      toast({
        title: "Success!",
        description: "Todo added successfully",
      });
      return newTodo;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTodoItem = async (id: string, todoUpdate: Partial<Omit<Todo, 'id' | 'user_id'>>) => {
    try {
      const updated = await updateTodo(id, todoUpdate);
      setTodos(prev => prev.map(todo => todo.id === id ? updated : todo));
      toast({
        title: "Success!",
        description: "Todo updated successfully",
      });
      return updated;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTodoItem = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast({
        title: "Success!",
        description: "Todo deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const toggleComplete = async (id: string, isCompleted: boolean) => {
    return updateTodoItem(id, { is_completed: isCompleted });
  };

  const value = {
    todos,
    projects,
    loading,
    addTodo,
    updateTodo: updateTodoItem,
    deleteTodo: deleteTodoItem,
    toggleComplete,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};
