import { Circle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type TodoCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

export function TodoCheckbox({ checked, onChange, className }: TodoCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "text-todo-purple focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded transition-colors",
        className
      )}
    >
      {checked ? (
        <CheckCircle className="h-6 w-6" />
      ) : (
        <Circle className="h-6 w-6" />
      )}
    </button>
  );
}
