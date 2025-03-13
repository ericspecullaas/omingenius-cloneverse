
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthDialog } from "@/components/auth/AuthDialog";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  
  // If user is not logged in, show sign in button
  if (!user) {
    return (
      <>
        <Button 
          variant="ghost" 
          onClick={() => setIsAuthDialogOpen(true)}
        >
          Sign In
        </Button>
        <AuthDialog 
          isOpen={isAuthDialogOpen} 
          onClose={() => setIsAuthDialogOpen(false)} 
          defaultMode="signin"
        />
      </>
    );
  }
  
  // Get initials from user email or username
  const getUserInitials = () => {
    if (!user) return "U";
    
    // Check if we have a profile with username
    if (user.user_metadata?.username) {
      const username = user.user_metadata.username;
      return username.substring(0, 2).toUpperCase();
    }
    
    // Fallback to email
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return "U";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.user_metadata?.username && (
              <p className="font-medium">{user.user_metadata.username}</p>
            )}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-600" 
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
