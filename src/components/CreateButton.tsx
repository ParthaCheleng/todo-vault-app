
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type CreateButtonProps = {
  onClick: () => void;
  className?: string;
  variant?: "normal" | "floating";
};

export function CreateButton({ onClick, className, variant = "normal" }: CreateButtonProps) {
  if (variant === "floating") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "w-12 h-12 rounded-full bg-todo-purple text-white flex items-center justify-center shadow-lg",
          "fixed bottom-6 right-6 z-10 hover:bg-todo-purple-light transition-colors",
          className
        )}
      >
        <Plus className="w-6 h-6" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full h-full p-4 bg-todo-dark-card rounded-xl border-2 border-dashed border-muted",
        "flex flex-col items-center justify-center gap-2 hover:border-todo-purple transition-colors",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-transparent border-2 border-dashed border-muted flex items-center justify-center">
        <Plus className="w-6 h-6 text-muted-foreground" />
      </div>
      <span className="text-muted-foreground font-medium">Create</span>
    </button>
  );
}
