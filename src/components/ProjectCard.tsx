import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TodoProject } from "@/types";

type ProjectCardProps = {
  project: TodoProject;
  className?: string;
  minimal?: boolean;
  onDelete?: () => void; // ✅ delete handler
};

export function ProjectCard({
  project,
  className,
  minimal = false,
  onDelete,
}: ProjectCardProps) {
  const todos = project.todos ?? [];
  const completedTodos = todos.filter((todo) => todo.is_completed).length;
  const totalTodos = todos.length;

  return (
    <Link to={`/project/${project.id}`}>
      <Card
        className={cn(
          "h-full relative transition-all hover:scale-[1.02] cursor-pointer bg-todo-dark-card border-0",
          className
        )}
      >
        <CardHeader className="pb-2 flex justify-between items-start">
          <CardTitle className="text-md flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: project.color || "#9D6EFF" }}
            />
            {project.name}
          </CardTitle>

          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete();
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {!minimal && (
            <>
              <div className="text-xs text-muted-foreground mb-2">
                {completedTodos} of {totalTodos} tasks
              </div>
              <ul className="space-y-1">
                {todos.slice(0, 3).map((todo) => (
                  <li
                    key={todo.id}
                    className="text-xs truncate text-muted-foreground"
                  >
                    {todo.title}
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
