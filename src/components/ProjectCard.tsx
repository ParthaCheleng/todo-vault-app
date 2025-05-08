
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TodoProject } from "@/types";

type ProjectCardProps = {
  project: TodoProject;
  className?: string;
  minimal?: boolean;
};

export function ProjectCard({ project, className, minimal = false }: ProjectCardProps) {
  // Calculate completed todos
  const completedTodos = project.todos.filter(todo => todo.is_completed).length;
  const totalTodos = project.todos.length;

  return (
    <Link to={`/project/${project.id}`}>
      <Card className={cn("h-full transition-all hover:scale-[1.02] cursor-pointer bg-todo-dark-card border-0", className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <span 
              className="w-5 h-5 rounded-full" 
              style={{ backgroundColor: project.color || '#9D6EFF' }} 
            />
            {project.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!minimal && (
            <>
              <div className="text-xs text-muted-foreground mb-2">
                {completedTodos} of {totalTodos} tasks
              </div>
              <ul className="space-y-1">
                {project.todos.slice(0, 3).map(todo => (
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
