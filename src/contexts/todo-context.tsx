import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getProjects,
  createProject,
  deleteProject,
} from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";
import type { Todo, TodoProject } from "@/types";

type TodoContextType = {
  todos: Todo[];
  projects: TodoProject[];
  loading: boolean;
  addTodo: (todo: Omit<Todo, "id" | "created_at" | "user_id">) => Promise<Todo>;
  updateTodo: (
    id: string,
    todo: Partial<Omit<Todo, "id" | "user_id">>
  ) => Promise<Todo>;
  deleteTodo: (id: string) => Promise<void>;
  toggleComplete: (id: string, isCompleted: boolean) => Promise<Todo>;
  addProject: (name: string) => Promise<TodoProject>;
  deleteProject: (projectId: string) => Promise<void>; // ✅ added
  refetchProjects: () => Promise<void>; // ✅ also useful to expose for live UI updates
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [projects, setProjects] = useState<TodoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // 🧠 Fetch data
  const fetchData = async () => {
    if (!user) {
      setTodos([]);
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [fetchedTodos, fetchedProjects] = await Promise.all([
        getTodos(),
        getProjects(),
      ]);
      setTodos(fetchedTodos);
      setProjects(fetchedProjects);
    } catch (error: any) {
      toast({
        title: "Failed to fetch data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // 🧩 CRUD Methods
  const addTodo = async (
    todo: Omit<Todo, "id" | "created_at" | "user_id">
  ) => {
    try {
      const newTodo = await createTodo(todo);
      setTodos((prev) => [newTodo, ...prev]);
      toast({ title: "Todo added successfully" });
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

  const updateTodoItem = async (
    id: string,
    updates: Partial<Omit<Todo, "id" | "user_id">>
  ) => {
    try {
      const updated = await updateTodo(id, updates);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updated : todo))
      );
      toast({ title: "Todo updated successfully" });
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
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      toast({ title: "Todo deleted" });
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

  const addProject = async (name: string): Promise<TodoProject> => {
    try {
      const newProject = await createProject(name);
      setProjects((prev) => [newProject, ...prev]);
      toast({ title: "Project created" });
      return newProject;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // ❌ Delete Project
  const removeProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast({ title: "Project deleted" });
    } catch (error: any) {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        projects,
        loading,
        addTodo,
        updateTodo: updateTodoItem,
        deleteTodo: deleteTodoItem,
        toggleComplete,
        addProject,
        deleteProject: removeProject, // ✅ exposed to consumers
        refetchProjects: fetchData,   // ✅ exposed for manual refetch
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};
