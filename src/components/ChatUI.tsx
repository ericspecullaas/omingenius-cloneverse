
import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatWelcome } from "@/components/chat/ChatWelcome";
import { InfoPanel } from "@/components/chat/InfoPanel";
import { Message } from "@/components/chat/types";

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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

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

  const toggleInfoPanel = () => {
    setIsInfoPanelOpen(!isInfoPanelOpen);
  };

  return (
    <div className="relative h-screen flex flex-col bg-background">
      <ChatHeader onInfoPanelToggle={toggleInfoPanel} />

      {/* Main chat area */}
      <div className="flex-grow overflow-y-auto">
        {messages.length === 1 ? (
          <ChatWelcome
            input={input}
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
            inputRef={inputRef}
          />
        ) : (
          <ChatMessageList messages={messages} isTyping={isTyping} />
        )}
      </div>

      {/* Input area */}
      {messages.length > 1 && (
        <ChatInput
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isTyping={isTyping}
          startNewChat={startNewChat}
        />
      )}

      {/* Info panel */}
      <AnimatePresence>
        {isInfoPanelOpen && (
          <InfoPanel isOpen={isInfoPanelOpen} onClose={toggleInfoPanel} />
        )}
      </AnimatePresence>
    </div>
  );
};
