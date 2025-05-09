import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types";

type TodoFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (todo: Omit<Todo, "id" | "created_at" | "user_id">) => void;
  initialData?: Todo;
  title?: string;
  projectId: string; // ✅ required again
};

export function TodoForm({
  open,
  onClose,
  onSubmit,
  initialData,
  title = "New Task",
  projectId,
}: TodoFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    is_completed: initialData?.is_completed || false,
    due_date: initialData?.due_date ? new Date(initialData.due_date) : undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) return;

    const todoToSubmit: Omit<Todo, "id" | "created_at" | "user_id"> = {
      ...formData,
      title: trimmedTitle,
      project_id: projectId,
      due_date: formData.due_date
        ? format(formData.due_date, "yyyy-MM-dd")
        : undefined,
    };

    onSubmit(todoToSubmit);
    onClose();
  };

  const isSubmitDisabled = !formData.title.trim();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-todo-dark-card border-0 text-foreground">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              placeholder="Task title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="bg-secondary border-0"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </label>
            <Textarea
              id="description"
              placeholder="Add details about the task"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="bg-secondary border-0 min-h-[80px]"
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label htmlFor="due-date" className="text-sm font-medium">
              Due Date (optional)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="due-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.due_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.due_date
                    ? format(formData.due_date, "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.due_date}
                  onSelect={(date) =>
                    setFormData({ ...formData, due_date: date || undefined })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Footer */}
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className={cn(
                "bg-todo-purple hover:bg-todo-purple-light",
                isSubmitDisabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {initialData ? "Update" : "Create"} Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
