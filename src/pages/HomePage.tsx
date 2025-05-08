
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useTodos } from "@/contexts/todo-context";
import { ProjectCard } from "@/components/ProjectCard";
import { CreateButton } from "@/components/CreateButton";
import { TodoForm } from "@/components/TodoForm";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, Bell } from "lucide-react";

export default function HomePage() {
  const { user, signOut } = useAuth();
  const { projects, loading, addTodo } = useTodos();
  const [showTodoForm, setShowTodoForm] = useState(false);

  const handleAddTodo = async (todoData: any) => {
    await addTodo(todoData);
    setShowTodoForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-todo-dark p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-20" />
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-todo-dark">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <UserAvatar />
            <div>
              <h2 className="text-sm font-medium">{user?.email}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => signOut()} className="text-muted-foreground">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Project Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          
          <div className="aspect-square">
            <CreateButton onClick={() => setShowTodoForm(true)} />
          </div>
        </div>
      </div>

      <TodoForm 
        open={showTodoForm} 
        onClose={() => setShowTodoForm(false)} 
        onSubmit={handleAddTodo} 
      />
    </div>
  );
}
