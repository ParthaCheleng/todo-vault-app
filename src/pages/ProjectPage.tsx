import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTodos } from "@/contexts/todo-context";
import { TodoItem } from "@/components/TodoItem";
import { TodoForm } from "@/components/TodoForm";
import { CreateButton } from "@/components/CreateButton";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Todo } from "@/types";

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, todos, loading, addTodo, updateTodo, deleteTodo, toggleComplete } = useTodos();
  const { toast } = useToast();

  const [showTodoForm, setShowTodoForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);

  // 🛡️ Log warning if route param fails
  useEffect(() => {
    if (!projectId) {
      console.warn("⚠️ projectId is undefined from URL.");
    }
  }, [projectId]);

  const project = projects.find((p) => p.id === projectId);
  const projectTodos = todos.filter((todo) => todo.project_id === projectId);

  const filteredTodos = showCompleted
    ? projectTodos
    : projectTodos.filter((todo) => !todo.is_completed);

  const handleAddTodo = async (todoData: Omit<Todo, "id" | "created_at" | "user_id">) => {
    try {
      await addTodo(todoData);
      setShowTodoForm(false);
      setEditingTodo(null);
    } catch (error: any) {
      toast({
        title: "Failed to add task",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowTodoForm(true);
  };

  const handleUpdateTodo = async (updatedData: Partial<Omit<Todo, "id" | "user_id">>) => {
    try {
      if (editingTodo) {
        await updateTodo(editingTodo.id, updatedData);
        setEditingTodo(null);
        setShowTodoForm(false);
      }
    } catch (error: any) {
      toast({
        title: "Failed to update task",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-todo-dark p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="space-y-4 mt-8">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-todo-dark p-6">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Button onClick={() => navigate("/")} variant="outline">
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-todo-dark">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-muted-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: project.color || "#9D6EFF" }}
              />
              {project.name}
            </h1>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              {projectTodos.length} {projectTodos.length === 1 ? "task" : "tasks"}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show completed</span>
                <Switch checked={showCompleted} onCheckedChange={setShowCompleted} />
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Filter className="h-4 w-4 mr-1" />
                <span>Filter</span>
              </Button>
            </div>
          </div>
        </header>

        <Separator className="my-4 bg-muted/20" />

        {/* Task List */}
        <div className="space-y-3 mt-6">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={(id, checked) => toggleComplete(id, checked)}
                onDelete={deleteTodo}
                onEdit={handleEditTodo}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tasks found</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <CreateButton
        onClick={() => {
          setEditingTodo(null);
          setShowTodoForm(true);
        }}
        variant="floating"
      />

      {/* Task Form */}
      <TodoForm
        open={showTodoForm}
        onClose={() => {
          setShowTodoForm(false);
          setEditingTodo(null);
        }}
        onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
        initialData={editingTodo || undefined}
        title={editingTodo ? "Edit Task" : "New Task"}
        projectId={project?.id || ""} // ✅ fallback to empty string if undefined
      />
    </div>
  );
}
