
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";

export function UserAvatar() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const initials = user.email
    .split('@')[0]
    .split('.')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <Avatar className="h-8 w-8">
      {user.avatar_url ? (
        <AvatarImage src={user.avatar_url} alt={user.email} />
      ) : null}
      <AvatarFallback className="bg-todo-purple text-white">
        {initials || <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}
