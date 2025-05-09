import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useTodos } from "@/contexts/todo-context";
import { ProjectCard } from "@/components/ProjectCard";
import { CreateButton } from "@/components/CreateButton";
import { TodoForm } from "@/components/TodoForm";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createProject, deleteProject } from "@/lib/supabase";

export default function HomePage() {
  const { user, signOut } = useAuth();
  const {
    projects,
    todos,
    loading,
    addTodo,
    addProject,
    deleteProject: removeProject,
    refetchProjects,
  } = useTodos();
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [projectName, setProjectName] = useState("");
  const { toast } = useToast();

  const handleAddTodo = async (todoData: any) => {
    if (!projects[0]?.id) {
      toast({
        title: "Project not found",
        description: "Please create a project before adding a task.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addTodo({ ...todoData, project_id: projects[0].id });
      setShowTodoForm(false);
    } catch (error: any) {
      toast({
        title: "Failed to add task",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;

    try {
      await addProject(projectName.trim());
      setProjectName("");
      setShowProjectDialog(false);
      await refetchProjects();
    } catch (error: any) {
      toast({
        title: "Failed to create project",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await removeProject(id);
      await refetchProjects();
    } catch (error: any) {
      toast({
        title: "Failed to delete project",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCreateClick = () => {
    if (!projects.length) {
      setShowProjectDialog(true);
    } else {
      setShowTodoForm(true);
    }
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

          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
            className="text-muted-foreground"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </header>

        {/* Project Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={() => handleDeleteProject(project.id)}
            />
          ))}

          <div className="aspect-square">
            <CreateButton onClick={handleCreateClick} />
          </div>
        </div>
      </div>

      {/* Task Form */}
      <TodoForm
        open={showTodoForm}
        onClose={() => setShowTodoForm(false)}
        onSubmit={handleAddTodo}
        projectId={projects[0]?.id}
        title="New Task"
      />

      {/* Project Creation Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="bg-todo-dark-card text-foreground border-0">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-secondary"
          />
          <DialogFooter className="pt-4">
            <Button
              onClick={() => setShowProjectDialog(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={!projectName.trim()}>
              Create Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
