import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/components/chat/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from 'uuid';

// --- CONFIGURATION ---
const RUNPOD_ENDPOINT_ID = "luh6jj0o7bxzuf"; // Your Endpoint ID
const RUNPOD_API_KEY = "YOUR_RUNPOD_API_KEY_HERE"; // <--- PASTE YOUR KEY HERE
const RUNPOD_URL = `https://api.runpod.ai/v2/${RUNPOD_ENDPOINT_ID}/runsync`;

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm OmniGenius, your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string>('default');
  const { toast } = useToast();
  const { user } = useAuth();

  // Load messages from Supabase
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

        if (error) throw error;

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
        timestamp: message.timestamp.toISOString(),
        chat_id: currentChatId
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  // --- THE REAL AI FUNCTION ---
  const askOmnigenius = async (userPrompt: string): Promise<string> => {
    try {
      const payload = {
        input: {
          prompt: userPrompt,
          max_tokens: 500,
          alpha: 0.015,
          recurrence: 4
        }
      };

      const response = await fetch(RUNPOD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RUNPOD_API_KEY}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.status === "COMPLETED") {
        return data.output.response;
      } else {
        console.error("RunPod Error:", data);
        return "I'm thinking too hard... (Server Timeout or Error)";
      }
    } catch (error) {
      console.error("Network Error:", error);
      return "Error: Could not reach the brain.";
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // 1. Add User Message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
      chat_id: currentChatId
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    if (user) saveMessage(userMessage);

    // 2. Call the Real AI (Omnigenius)
    const aiResponseText = await askOmnigenius(content.trim());

    // 3. Add AI Response
    const assistantMessage: Message = {
      id: uuidv4(),
      role: "assistant",
      content: aiResponseText,
      timestamp: new Date(),
      chat_id: currentChatId
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);

    if (user) saveMessage(assistantMessage);
  };

  const startNewChat = () => {
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
    }
  };

  return {
    messages,
    isTyping,
    isLoading,
    currentChatId,
    sendMessage,
    startNewChat
  };
}
