
import { useState } from "react";
import { TodoCheckbox } from "@/components/TodoCheckbox";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Trash, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types";

type TodoItemProps = {
  todo: Todo;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  className?: string;
};

export function TodoItem({ todo, onToggleComplete, onDelete, onEdit, className }: TodoItemProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Card 
      className={cn("border-0 bg-todo-dark-card", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardContent className="p-4 flex items-center gap-3 relative">
        <TodoCheckbox 
          checked={todo.is_completed} 
          onChange={(checked) => onToggleComplete(todo.id, checked)} 
        />
        
        <div className="flex-1 min-w-0">
          <h3 className={cn("font-medium truncate", todo.is_completed && "line-through opacity-70")}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {todo.description}
            </p>
          )}

          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(todo.created_at), { addSuffix: true })}
          </p>
        </div>

        {isHovering && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit(todo)} 
              className="p-1 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
            
            <button 
              onClick={() => onDelete(todo.id)} 
              className="p-1 rounded-full hover:bg-secondary text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
