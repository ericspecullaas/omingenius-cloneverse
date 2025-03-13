
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Download, Moon, Sun, CreditCard, Key } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set the page title
    document.title = "User Profile - OmniGenius";
    
    // Check if dark mode is enabled
    const isDark = localStorage.getItem("theme") === "dark";
    setIsDarkMode(isDark);
    
    return () => {
      document.title = "OmniGenius";
    };
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.user_metadata?.username || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: values.email,
        data: { username: values.username }
      });
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Update the HTML element class for dark mode
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    
    toast({
      title: newDarkMode ? "Dark mode enabled" : "Light mode enabled",
      description: `The app theme has been switched to ${newDarkMode ? "dark" : "light"} mode.`,
    });
  };

  const downloadChats = () => {
    toast({
      title: "Coming soon",
      description: "The chat export feature will be available soon!",
    });
  };
  
  if (!user) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container max-w-4xl py-10">
        <h1 className="text-3xl font-bold mb-8">User Profile</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="billing">Billing & Subscription</TabsTrigger>
            <TabsTrigger value="api">API Access</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormDescription>
                          We'll send important notifications to this email.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                  {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                </div>
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Data & Privacy</h2>
              <div className="space-y-4">
                <Button variant="outline" onClick={downloadChats}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Chat History
                </Button>
                <FormDescription>
                  Export all your chat conversations as a JSON file.
                </FormDescription>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="billing" className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Subscription Plan</h2>
              <div className="mb-6">
                <p className="text-muted-foreground">
                  You are currently on the <span className="font-medium text-foreground">Free</span> plan.
                </p>
                <Link to="/pricing">
                  <Button className="mt-4" variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </Button>
                </Link>
              </div>
              
              <h3 className="text-lg font-medium mt-8 mb-4">Payment Methods</h3>
              <div className="bg-muted/50 p-6 rounded-md text-center">
                <p className="text-muted-foreground">
                  No payment methods added yet.
                </p>
                <Button className="mt-4" variant="outline" onClick={() => {
                  toast({
                    title: "Coming soon",
                    description: "Payment method management will be available soon!",
                  });
                }}>
                  Add Payment Method
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">API Access</h2>
              <div className="mb-6">
                <p className="text-muted-foreground mb-4">
                  Use your API key to access OmniGenius services programmatically.
                </p>
                <Button variant="outline" onClick={() => {
                  toast({
                    title: "Coming soon",
                    description: "API key management will be available soon!",
                  });
                }}>
                  <Key className="mr-2 h-4 w-4" />
                  Generate API Key
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 flex justify-end">
          <Link to="/chat">
            <Button variant="ghost">Back to Chat</Button>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default UserProfile;
