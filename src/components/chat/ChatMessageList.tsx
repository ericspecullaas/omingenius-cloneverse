
import { useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { Bot } from "./ChatBot";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageListProps {
  messages: Message[];
  isTyping: boolean;
}

export const ChatMessageList = ({ messages, isTyping }: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
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
  );
};
