
import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatWelcome } from "@/components/chat/ChatWelcome";
import { InfoPanel } from "@/components/chat/InfoPanel";
import { Message } from "@/components/chat/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from 'uuid';

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
  const [isLoading, setIsLoading] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string>('default');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load messages from Supabase when the component mounts
  useEffect(() => {
    const loadMessages = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', user.id)
          .eq('chat_id', currentChatId)
          .order('timestamp', { ascending: true });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const loadedMessages: Message[] = data.map(msg => ({
            id: msg.id,
            role: msg.role as "user" | "assistant",
            content: msg.content,
            timestamp: new Date(msg.timestamp),
            chat_id: msg.chat_id
          }));
          setMessages(loadedMessages);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        toast({
          title: "Error loading messages",
          description: "There was a problem loading your chat history.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [user, currentChatId, toast]);

  // Save message to Supabase
  const saveMessage = async (message: Message) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('chat_messages').insert({
        id: message.id,
        user_id: user.id,
        content: message.content,
        role: message.role,
        timestamp: message.timestamp,
        chat_id: currentChatId
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error saving message:", error);
      toast({
        title: "Error saving message",
        description: "There was a problem saving your message.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      chat_id: currentChatId
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Save user message to Supabase if logged in
    if (user) {
      saveMessage(userMessage);
    }

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
        id: uuidv4(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date(),
        chat_id: currentChatId
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);

      // Save assistant message to Supabase if logged in
      if (user) {
        saveMessage(assistantMessage);
      }
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

  const startNewChat = async () => {
    if (messages.length > 1) {
      const newChatId = uuidv4();
      setCurrentChatId(newChatId);
      
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: "Hello! I'm OmniGenius, your AI assistant. How can I help you today?",
          timestamp: new Date(),
          chat_id: newChatId
        },
      ]);
      
      toast({
        title: "New chat started",
        description: "Previous chat has been saved",
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
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 1 ? (
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
      {(messages.length > 1 || isLoading === false) && (
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
