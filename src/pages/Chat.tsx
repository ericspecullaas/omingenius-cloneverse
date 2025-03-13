
import { useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";
import { ChatUI } from "@/components/ChatUI";

const Chat = () => {
  // Set the page title
  useEffect(() => {
    document.title = "Chat - OmniGenius";
    
    return () => {
      document.title = "OmniGenius";
    };
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <ChatUI />
      </div>
    </PageTransition>
  );
};

export default Chat;
