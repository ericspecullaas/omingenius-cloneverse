
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Globe, Microscope } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ChatWelcomeProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

export const ChatWelcome = ({ 
  input, 
  handleInputChange, 
  handleKeyDown, 
  inputRef 
}: ChatWelcomeProps) => {
  const { toast } = useToast();

  const handleSearchClick = () => {
    toast({
      title: "Web search",
      description: "Web search capability will be available soon!",
    });
  };

  const handleDeepResearchClick = () => {
    toast({
      title: "Deep thinking",
      description: "Deep thinking capability will be available soon!",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-4">
      <h2 className="text-3xl font-bold text-foreground mb-6">What can I help with?</h2>
      <div className="w-full max-w-3xl">
        <Textarea 
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything"
          className="resize-none text-lg py-6 px-4 min-h-[60px] border-secondary shadow-soft focus:shadow-medium transition-shadow duration-300 rounded-xl"
          rows={1}
        />
        <div className="flex mt-4 gap-2 justify-center">
          <Button 
            variant="outline" 
            className="gap-2 py-6 px-4 h-auto rounded-lg border-muted"
            onClick={handleSearchClick}
          >
            <Globe className="h-5 w-5" />
            <span>Search</span>
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 py-6 px-4 h-auto rounded-lg border-muted"
            onClick={handleDeepResearchClick}
          >
            <Microscope className="h-5 w-5" />
            <span>Deep research</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
