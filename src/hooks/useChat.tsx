import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/components/chat/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from 'uuid';

// --- OMNIGENIUS CONFIGURATION ---
const RUNPOD_ENDPOINT_ID = "luh6jj0o7bxzuf"; 
const RUNPOD_API_KEY = import.meta.env.VITE_RUNPOD_API_KEY;

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "System Online. Omnigenius Architecture loaded. I am ready to reason.",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string>('default');
  const { toast } = useToast();
  const { user } = useAuth();

  // 1. Load History (Same as before)
  useEffect(() => {
    const loadMessages = async () => {
      if (!user) { setIsLoading(false); return; }
      try {
        const { data, error } = await supabase.from('chat_messages').select('*').eq('user_id', user.id).eq('chat_id', currentChatId).order('timestamp', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          const loadedMessages: Message[] = data.map(msg => ({ id: msg.id, role: msg.role as "user" | "assistant", content: msg.content, timestamp: new Date(msg.timestamp), chat_id: msg.chat_id }));
          setMessages(loadedMessages);
        }
      } catch (error) { console.error("Error loading messages:", error); } finally { setIsLoading(false); }
    };
    loadMessages();
  }, [user, currentChatId]);

  // 2. Save Helper
  const saveMessage = async (message: Message) => {
    if (!user) return;
    try { await supabase.from('chat_messages').insert({ id: message.id, user_id: user.id, content: message.content, role: message.role, timestamp: message.timestamp.toISOString(), chat_id: currentChatId }); } catch (error) { console.error("Error saving message:", error); }
  };

  // --- 3. THE FIXED API LOGIC (Polling for Load Balancer) ---
  const askOmnigenius = async (userPrompt: string): Promise<string> => {
    try {
      // Step A: Submit the Job
      const runUrl = `https://api.runpod.ai/v2/${RUNPOD_ENDPOINT_ID}/run`;
      
      const response = await fetch(runUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RUNPOD_API_KEY}` },
        body: JSON.stringify({
          input: {
            prompt: userPrompt,
            max_tokens: 500,
            alpha: 0.015,
            recurrence: 4
          }
        })
      });

      const data = await response.json();
      const jobId = data.id;
      
      if (!jobId) {
        console.error("RunPod Submission Failed:", data);
        return "Error: Failed to submit thought process.";
      }

      // Step B: Poll for Status
      const statusUrl = `https://api.runpod.ai/v2/${RUNPOD_ENDPOINT_ID}/status/${jobId}`;
      let attempts = 0;
      
      while (attempts < 120) { // Wait up to 2 minutes
        await new Promise(r => setTimeout(r, 1000)); // Wait 1 second
        
        const statusRes = await fetch(statusUrl, {
          headers: { "Authorization": `Bearer ${RUNPOD_API_KEY}` }
        });
        const statusData = await statusRes.json();
        
        if (statusData.status === "COMPLETED") {
          return statusData.output.response;
        } else if (statusData.status === "FAILED") {
          console.error("Job Failed:", statusData);
          return "Error: The model crashed while thinking.";
        }
        
        attempts++;
      }
      return "Error: Timed out waiting for thought.";

    } catch (error) {
      console.error("Network Error:", error);
      return "Connection Error: Could not reach the Neural Cloud.";
    }
  };

  // 4. Handle User Input
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    const userMessage: Message = { id: uuidv4(), role: "user", content: content.trim(), timestamp: new Date(), chat_id: currentChatId };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    if (user) saveMessage(userMessage);

    const aiResponseText = await askOmnigenius(content.trim());

    const assistantMessage: Message = { id: uuidv4(), role: "assistant", content: aiResponseText, timestamp: new Date(), chat_id: currentChatId };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
    if (user) saveMessage(assistantMessage);
  };

  const startNewChat = () => {
    const newChatId = uuidv4();
    setCurrentChatId(newChatId);
    setMessages([{ id: "welcome", role: "assistant", content: "System Online. Memory cleared. Ready for new input.", timestamp: new Date(), chat_id: newChatId }]);
  };

  return { messages, isTyping, isLoading, currentChatId, sendMessage, startNewChat };
}
