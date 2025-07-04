import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { SiFacebook, SiGoogle, SiApple } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [location, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupForm) => {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error(`Signup failed: ${response.status}`);
      }
      
      return await response.json();
    },
    onSuccess: (response) => {
      toast({
        title: "Account created successfully",
        description: "Welcome to BloodSource! You can now log in.",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Signup error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignupForm) => {
    signupMutation.mutate(data);
  };

  const handleSocialSignup = (provider: string) => {
    toast({
      title: `${provider} signup`,
      description: `Sign up with ${provider} clicked`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-facebook-gray animate-in fade-in duration-500">
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-lg animate-in slide-in-from-bottom-4 duration-700">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/")}
                  className="absolute left-4 top-4 p-2 hover:bg-facebook-gray"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <CardTitle className="text-2xl font-bold text-[#d91c1f]">
                  Join BloodSource
                </CardTitle>
              </div>
              <p className="text-facebook-muted text-sm">
                Create your account to get started
              </p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* First Name and Last Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-facebook-muted w-4 h-4" />
                              <Input
                                placeholder="First name"
                                className="pl-10 pr-4 py-3 bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent text-sm"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-facebook-muted w-4 h-4" />
                              <Input
                                placeholder="Last name"
                                className="pl-10 pr-4 py-3 bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent text-sm"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Email Input */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-facebook-muted w-4 h-4" />
                            <Input
                              placeholder="Email address"
                              className="pl-10 pr-4 py-3 bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Input */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-facebook-muted w-4 h-4" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              className="pl-10 pr-12 py-3 bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent"
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-facebook-muted"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Sign Up Button */}
                  <Button
                    type="submit"
                    disabled={signupMutation.isPending}
                    className="w-full bg-facebook-success hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-md transition duration-200 ease-in-out disabled:opacity-50"
                  >
                    {signupMutation.isPending ? "Creating account..." : "Sign Up"}
                  </Button>

                  {/* Terms */}
                  <p className="text-xs text-facebook-muted text-center leading-relaxed">
                    By clicking Sign Up, you agree to our{" "}
                    <a href="#" className="text-facebook-blue hover:underline">
                      Terms
                    </a>
                    ,{" "}
                    <a href="#" className="text-facebook-blue hover:underline">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-facebook-blue hover:underline">
                      Cookies Policy
                    </a>
                    .
                  </p>

                  {/* Divider */}
                  <div className="flex items-center my-6">
                    <Separator className="flex-1" />
                    <span className="px-4 text-facebook-muted text-sm">or</span>
                    <Separator className="flex-1" />
                  </div>

                  {/* Social Signup Buttons */}
                  <div className="space-y-3">
                    <Button
                      type="button"
                      onClick={() => handleSocialSignup("Facebook")}
                      className="w-full bg-facebook-blue hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center gap-2"
                    >
                      <SiFacebook />
                      Sign up with Facebook
                    </Button>

                    <Button
                      type="button"
                      onClick={() => handleSocialSignup("Google")}
                      className="w-full bg-white border border-facebook-border hover:bg-gray-50 text-facebook-text font-medium py-3 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center gap-2"
                    >
                      <SiGoogle className="text-red-500" />
                      Sign up with Google
                    </Button>

                    <Button
                      type="button"
                      onClick={() => handleSocialSignup("Apple")}
                      className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center gap-2"
                    >
                      <SiApple />
                      Sign up with Apple
                    </Button>
                  </div>

                  {/* Back to Login */}
                  <div className="text-center border-t border-facebook-border pt-4 mt-6">
                    <p className="text-facebook-muted text-sm">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="text-facebook-blue hover:underline font-medium"
                      >
                        Log in
                      </button>
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}