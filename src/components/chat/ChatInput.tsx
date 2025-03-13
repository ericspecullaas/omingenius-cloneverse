
import { useRef, useEffect } from "react";
import { Send, Plus, Globe, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isTyping: boolean;
  startNewChat: () => void;
}

export const ChatInput = ({ 
  input, 
  setInput, 
  handleSubmit, 
  isTyping,
  startNewChat 
}: ChatInputProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

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

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="border-t border-border/80 backdrop-blur-sm bg-background/90 p-4 sm:p-6">
      <div className="container mx-auto max-w-4xl">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message OmniGenius..."
            className="resize-none pr-14 py-4 min-h-[60px] max-h-60 border-secondary shadow-soft focus:shadow-medium transition-shadow duration-300"
            rows={1}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute bottom-2.5 right-2.5 h-8 w-8 rounded-full"
            disabled={!input.trim() || isTyping}
          >
            <Send size={16} />
          </Button>
        </form>
        <div className="flex justify-between mt-2 px-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={startNewChat}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            New chat
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={handleSearchClick}
            >
              <Globe className="h-3.5 w-3.5 mr-1" />
              Search
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={handleDeepResearchClick}
            >
              <Microscope className="h-3.5 w-3.5 mr-1" />
              Deep research
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
