
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Hero = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const fullText = "The future of intelligent conversation.";
  const typingSpeed = 50; // milliseconds per character
  const typingDelayStart = 500; // delay before typing starts

  // Reference for the container to track when it's in view
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Typing effect
  useEffect(() => {
    if (!isInView) return;
    
    let currentText = "";
    let currentIndex = 0;

    const typingTimer = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex < fullText.length) {
          currentText += fullText.charAt(currentIndex);
          setTypedText(currentText);
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, typingSpeed);

      return () => clearInterval(interval);
    }, typingDelayStart);

    return () => clearTimeout(typingTimer);
  }, [isInView]);

  // Intersection observer to check if the hero is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const backgroundGradient = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      filter: "blur(10px)"
    },
    visible: { 
      opacity: 0.7, 
      scale: 1, 
      filter: "blur(0px)",
      transition: { 
        duration: 1.5, 
        ease: [0.6, 0.05, 0.01, 0.9] 
      }
    },
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20 pb-20"
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={backgroundGradient}
      >
        <div className="absolute -inset-[10%] bg-gradient-to-r from-primary/10 via-secondary/20 to-accent/10 rounded-full transform rotate-12 blur-3xl opacity-50"></div>
        <div className="absolute top-1/3 -right-[20%] w-[80%] h-[50%] bg-gradient-to-l from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-[10%] w-[60%] h-[40%] bg-gradient-to-t from-accent/10 via-accent/5 to-transparent rounded-full blur-3xl"></div>
      </motion.div>

      <motion.div
        className="container relative z-10 px-6 flex flex-col items-center text-center max-w-4xl mx-auto space-y-12"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Pill badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
        >
          <Sparkles size={14} className="mr-1" />
          <span>Meet OmniGenius — Your AI Companion</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
        >
          Experience AI <br className="hidden sm:block" />
          <span className="text-primary">Beyond Imagination</span>
        </motion.h1>

        {/* Typing effect subtitle */}
        <motion.div
          variants={itemVariants}
          className="h-8"
        >
          <span className="text-xl md:text-2xl text-muted-foreground">
            {typedText}
            <span className="animate-pulse">|</span>
          </span>
        </motion.div>

        {/* Call to action */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full justify-center items-center"
        >
          <Button 
            size="lg" 
            className="group text-base px-6 py-6 rounded-xl shadow-soft transition-all duration-300 hover:shadow-medium"
            onClick={() => navigate("/chat")}
          >
            <span>Start Chatting</span>
            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-base px-6 py-6 rounded-xl bg-background/50 backdrop-blur-sm"
          >
            Learn More
          </Button>
        </motion.div>

        {/* Preview image */}
        <motion.div
          className="w-full max-w-3xl mx-auto mt-12 rounded-xl overflow-hidden shadow-medium border border-border/50"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { 
                delay: 0.6,
                duration: 0.7,
                ease: [0.23, 1, 0.32, 1]
              }
            }
          }}
        >
          <div className={cn(
            "relative w-full aspect-[16/9] glass-card overflow-hidden",
            "before:absolute before:inset-0 before:bg-gradient-to-t before:from-background/10 before:to-transparent before:z-10"
          )}>
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="glass-soft rounded-full px-4 py-1 text-sm flex items-center">
                  <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                  OmniGenius
                </div>
                <div className="glass-soft rounded-full px-4 py-1 text-sm">
                  Model: GPT-4 Turbo
                </div>
              </div>
              <div className="space-y-4">
                <div className="glass-soft rounded-xl p-4 text-left max-w-lg">
                  <p className="text-sm font-medium text-foreground/80">How can I create a sustainable business model?</p>
                </div>
                <div className="glass-soft rounded-xl p-4 text-left ml-auto max-w-lg">
                  <p className="text-sm font-medium text-foreground/80">
                    Creating a sustainable business model involves balancing economic growth with environmental responsibility and social impact. Here are key strategies...
                  </p>
                </div>
              </div>
              <div className="glass-soft rounded-xl p-3 flex items-center">
                <input 
                  type="text" 
                  className="w-full bg-transparent border-none outline-none text-sm placeholder:text-foreground/50" 
                  placeholder="Message OmniGenius..." 
                  disabled 
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
