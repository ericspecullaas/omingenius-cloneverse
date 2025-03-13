
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

type AuthMode = "signin" | "signup";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
}

export function AuthDialog({ isOpen, onClose, defaultMode = "signin" }: AuthDialogProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === "signin" ? "Welcome Back" : "Create an Account"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signin" 
              ? "Sign in to your OmniGenius account to continue" 
              : "Join OmniGenius to start your AI conversation journey"}
          </DialogDescription>
        </DialogHeader>
        
        {mode === "signin" ? (
          <SignInForm onSuccess={onClose} onSwitchMode={() => setMode("signup")} />
        ) : (
          <SignUpForm onSuccess={onClose} onSwitchMode={() => setMode("signin")} />
        )}
      </DialogContent>
    </Dialog>
  );
}
