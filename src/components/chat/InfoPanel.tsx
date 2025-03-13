
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface InfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoPanel = ({ isOpen, onClose }: InfoPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : 300 }}
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
            onClick={onClose}
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
  );
};
