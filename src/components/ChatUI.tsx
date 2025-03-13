
import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessageList } from "@/components/chat/ChatMessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatWelcome } from "@/components/chat/ChatWelcome";
import { InfoPanel } from "@/components/chat/InfoPanel";
import { useChat } from "@/hooks/useChat";
import { useChatInput } from "@/hooks/useChatInput";

export const ChatUI = () => {
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const { 
    messages, 
    isTyping, 
    isLoading, 
    sendMessage, 
    startNewChat 
  } = useChat();
  
  const { 
    input, 
    setInput, 
    inputRef, 
    handleSubmit, 
    handleInputChange, 
    handleKeyDown 
  } = useChatInput(sendMessage);

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
