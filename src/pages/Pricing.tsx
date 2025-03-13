
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const PricingTier = ({ 
  name, 
  price, 
  features, 
  isPopular = false,
  buttonText = "Get Started" 
}: { 
  name: string; 
  price: string; 
  features: string[]; 
  isPopular?: boolean;
  buttonText?: string;
}) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleClick = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to a plan",
      });
    } else {
      toast({
        title: "Coming soon",
        description: "Payment processing will be available soon!",
      });
    }
  };

  return (
    <div className={`relative rounded-xl border bg-background p-6 shadow-sm ${
      isPopular ? "border-primary ring-2 ring-primary ring-offset-2" : ""
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <div className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            Most Popular
          </div>
        </div>
      )}
      <div className="mb-5">
        <h3 className="text-lg font-medium">{name}</h3>
        <div className="mt-2 flex items-baseline">
          <span className="text-3xl font-bold">{price}</span>
          <span className="ml-1 text-sm text-muted-foreground">/month</span>
        </div>
      </div>
      <ul className="mb-6 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckIcon className="mr-2 h-4 w-4 text-primary" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        className="w-full"
        onClick={handleClick}
        variant={isPopular ? "default" : "outline"}
      >
        {buttonText}
      </Button>
    </div>
  );
};

const Pricing = () => {
  // Set the page title
  useEffect(() => {
    document.title = "Pricing - OmniGenius";
    
    return () => {
      document.title = "OmniGenius";
    };
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Choose the right plan for you
            </h1>
            <p className="mt-5 text-xl text-muted-foreground">
              Start with a free trial. Upgrade or downgrade at any time.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <PricingTier
              name="Starter"
              price="$20"
              features={[
                "500 messages per month",
                "Basic AI assistance",
                "Standard response time",
                "Email support"
              ]}
            />
            <PricingTier
              name="Pro"
              price="$50"
              features={[
                "2,000 messages per month",
                "Advanced AI capabilities",
                "Priority response time",
                "24/7 email and chat support",
                "Custom training"
              ]}
              isPopular={true}
            />
            <PricingTier
              name="Startup"
              price="$100"
              features={[
                "5,000 messages per month",
                "Full AI feature access",
                "Dedicated account manager",
                "API access",
                "Custom integrations",
                "Team collaboration"
              ]}
            />
            <PricingTier
              name="Enterprise"
              price="Custom"
              features={[
                "Unlimited messages",
                "White-label solution",
                "SLA guarantee",
                "On-premise deployment option",
                "Custom AI model training",
                "24/7 priority support"
              ]}
              buttonText="Contact Sales"
            />
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold">Educational Discount</h2>
            <p className="mt-3 text-muted-foreground">
              We offer special pricing for educational institutions.
              Contact our sales team for more information.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => 
              window.location.href = "mailto:education@omnigenius.com"
            }>
              Contact for Educational Pricing
            </Button>
          </div>

          <div className="mt-16 text-center">
            <Link to="/chat">
              <Button variant="ghost">Back to Chat</Button>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Pricing;
