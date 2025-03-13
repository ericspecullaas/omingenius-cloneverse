
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Info, X, Plus, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/ChatMessage";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const ChatUI = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm OmniGenius, your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponses = [
        "I understand your question. Based on my analysis, there are several approaches we could take to solve this problem.",
        "That's an interesting topic. There are multiple perspectives to consider here, and I'd be happy to explore them with you.",
        "Thanks for sharing that. I can provide some insights based on the available information, though I recommend consulting with a specialist for definitive advice.",
        "I've processed your request and here's what I found. Let me know if you'd like me to elaborate on any specific aspect.",
        "Great question! This is a complex topic with various nuances. Let me break it down for you in a comprehensive way.",
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const startNewChat = () => {
    if (messages.length > 1) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Hello! I'm OmniGenius, your AI assistant. How can I help you today?",
          timestamp: new Date(),
        },
      ]);
      toast({
        title: "New chat started",
        description: "Previous chat has been cleared",
      });
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="relative h-screen flex flex-col bg-background">
      {/* Header */}
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
            onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
          >
            <Info size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => toast({
              title: "Coming soon",
              description: "Settings functionality will be available soon!",
            })}
          >
            <Settings size={18} />
          </Button>
        </div>
      </header>

      {/* Main chat area */}
      <div className="flex-grow overflow-y-auto">
        <div className="min-h-full flex flex-col">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              typingEffect={isTyping && index === messages.length - 1}
            />
          ))}
          {isTyping && (
            <div className="py-6 px-4 sm:px-6 flex bg-secondary/50">
              <div className="container mx-auto max-w-4xl flex gap-4 sm:gap-6">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary animate-pulse" />
                  </div>
                </div>
                <div className="flex-1 flex items-center">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse"></div>
                    <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse delay-150"></div>
                    <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
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
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => toast({
                title: "Coming soon",
                description: "Model selection will be available soon!",
              })}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              GPT-4 Turbo
            </Button>
          </div>
        </div>
      </div>

      {/* Info panel */}
      <AnimatePresence>
        {isInfoPanelOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute top-0 right-0 z-50 h-full w-full sm:max-w-sm glass-card border-l border-border/80 shadow-medium"
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">About OmniGenius</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsInfoPanelOpen(false)}
                >
                  <X size={18} />
                </Button>
              </div>
              
              <div className="space-y-6 overflow-y-auto flex-grow">
                <div>
                  <h3 className="text-lg font-medium mb-2">What is OmniGenius?</h3>
                  <p className="text-sm text-muted-foreground">
                    OmniGenius is an advanced AI assistant designed to provide helpful, accurate, and thoughtful responses to your questions and tasks.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Capabilities</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Answer questions and provide information</li>
                    <li>• Assist with creative writing and brainstorming</li>
                    <li>• Help with problem-solving and analysis</li>
                    <li>• Provide coding assistance and debugging</li>
                    <li>• Offer explanations on complex topics</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Limitations</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• May not have knowledge of events after training</li>
                    <li>• Can occasionally make mistakes or provide inaccurate information</li>
                    <li>• Limited understanding of context in long conversations</li>
                    <li>• Cannot browse the internet or access external files</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    Your conversations with OmniGenius are private and secure. We do not use your conversations for training or share them with third parties.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border/80">
                <p className="text-xs text-muted-foreground text-center">
                  OmniGenius v1.0 • Made with care
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Bot = (props: any) => <Sparkles {...props} />;
