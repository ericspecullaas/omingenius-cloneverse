
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Brain, Code, Sparkles, Shield, BookOpen, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Brain,
    name: "Advanced Intelligence",
    description: "Powered by state-of-the-art language models for human-like conversations and problem-solving capabilities."
  },
  {
    icon: Code,
    name: "Code Assistance",
    description: "Write, debug, and understand code with expert guidance across multiple programming languages."
  },
  {
    icon: Sparkles,
    name: "Creative Companion",
    description: "Generate ideas, create content, and explore new concepts with an AI that understands creativity."
  },
  {
    icon: Shield,
    name: "Privacy-Focused",
    description: "Your conversations remain private with strong security measures to protect your sensitive information."
  },
  {
    icon: BookOpen,
    name: "Knowledge Access",
    description: "Tap into a vast knowledge base with up-to-date information to answer your questions accurately."
  },
  {
    icon: Zap,
    name: "Instant Responses",
    description: "Get immediate, thoughtful replies to keep your workflow smooth and productive without delays."
  }
];

export const Features = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="relative py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Unlock Powerful Capabilities</h2>
          <p className="text-muted-foreground text-lg">
            Discover how OmniGenius transforms the way you work, create, and solve problems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1 * index, 
                ease: [0.23, 1, 0.32, 1] 
              }}
              className={cn(
                "glass-card p-6 hover:shadow-medium transition-all duration-300 transform group",
                "hover:translate-y-[-5px]",
              )}
            >
              <div className="mb-4 p-3 rounded-full bg-primary/10 w-fit">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                {feature.name}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
