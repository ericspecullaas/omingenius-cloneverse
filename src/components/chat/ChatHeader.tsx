
import { Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UserMenu } from "@/components/UserMenu";

interface ChatHeaderProps {
  onInfoPanelToggle: () => void;
}

export const ChatHeader = ({ onInfoPanelToggle }: ChatHeaderProps) => {
  const { toast } = useToast();

  return (
    <header className="flex justify-between items-center py-3 px-4 sm:px-6 border-b border-border/80 backdrop-blur-sm bg-background/90 z-10">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          onClick={() => toast({
            title: "Coming soon",
            description: "Sidebar functionality will be available soon!",
          })}
        >
          <Plus size={20} />
        </Button>
        <h1 className="text-lg font-medium">OmniGenius Chat</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          onClick={onInfoPanelToggle}
        >
          <Info size={18} />
        </Button>
        <UserMenu />
      </div>
    </header>
  );
};
