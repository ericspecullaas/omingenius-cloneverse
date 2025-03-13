
import { useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";

const Index = () => {
  // Set the page title
  useEffect(() => {
    document.title = "OmniGenius - The Future of Intelligent Conversation";
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Hero />
          <Features />
        </main>
      </div>
    </PageTransition>
  );
};

export default Index;
