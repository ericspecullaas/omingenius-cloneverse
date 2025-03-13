
import { useState, useEffect, useRef } from "react";
import { User, Bot, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Avatar } from "@/components/ui/avatar";

export interface ChatMessageProps {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  };
  typingEffect?: boolean;
}

export const ChatMessage = ({ message, typingEffect = false }: ChatMessageProps) => {
  const [isTyping, setIsTyping] = useState(typingEffect && message.role === "assistant");
  const [displayedContent, setDisplayedContent] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const typingSpeed = 10; // milliseconds per character
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  // Typing effect for assistant messages
  useEffect(() => {
    if (!isTyping) {
      setDisplayedContent(message.content);
      return;
    }

    let currentText = "";
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < message.content.length) {
        currentText += message.content.charAt(currentIndex);
        setDisplayedContent(currentText);
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [isTyping, message.content]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied",
      duration: 2000,
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const messageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={messageVariants}
      className={cn(
        "py-6 px-4 sm:px-6 flex",
        message.role === "assistant" ? "bg-secondary/50" : "bg-background"
      )}
    >
      <div className="container mx-auto max-w-4xl flex gap-4 sm:gap-6">
        <div className="flex-shrink-0 mt-1">
          <Avatar className={cn(
            "h-8 w-8 sm:h-10 sm:w-10 rounded-full",
            message.role === "assistant" ? "bg-primary/10" : "bg-secondary"
          )}>
            {message.role === "assistant" ? (
              <Bot className="h-5 w-5 text-primary" />
            ) : (
              <User className="h-5 w-5 text-foreground" />
            )}
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1 gap-2">
            <h3 className="text-sm font-medium text-foreground">
              {message.role === "assistant" ? "OmniGenius" : "You"}
            </h3>
            <span className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div 
            ref={contentRef}
            className={cn(
              "prose prose-sm dark:prose-invert max-w-none text-foreground/90",
              isTyping && "after:content-['|'] after:animate-pulse after:ml-0.5"
            )}
          >
            {displayedContent.split("\n").map((paragraph, index) => (
              <p key={index} className={index > 0 ? "mt-2" : ""}>
                {paragraph}
              </p>
            ))}
          </div>
          {message.role === "assistant" && !isTyping && (
            <div className="mt-3 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 h-7 rounded-full"
                onClick={copyToClipboard}
              >
                {isCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
