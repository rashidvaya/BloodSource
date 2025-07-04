import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { SiFacebook, SiGoogle, SiApple } from "react-icons/si";
import FloatingAIButton from "@/components/FloatingAIButton";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Email address or phone number is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function HomePage() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginForm) => {
    toast({
      title: "Login attempt",
      description: `Username: ${data.username}`,
    });
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `${provider} login`,
      description: `Continue with ${provider} clicked`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-facebook-gray">
      <main className="flex-1 flex items-center justify-center px-4 py-8 lg:py-0">
        <div className="w-full max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Brand Section */}
            <div className="text-left">
              <div className="mb-4">
                <h1 className="text-6xl font-bold tracking-tight facebook-blue">
                  facebook
                </h1>
              </div>
              <p className="text-facebook-text text-2xl font-normal leading-8 max-w-lg">
                Facebook helps you connect and share with the people in your life.
              </p>
            </div>

            {/* Login Section */}
            <div className="w-full max-w-md mx-auto">
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      {/* Username/Email Input */}
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-facebook-muted w-4 h-4" />
                                <Input
                                  placeholder="Email address or phone number"
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

                      {/* Login Button */}
                      <Button
                        type="submit"
                        className="w-full bg-[#d91c1f] hover:bg-red-700 text-[#ffffff] font-semibold py-3 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
                      >
                        Log in
                      </Button>

                      {/* Forgot Password Link */}
                      <div className="text-center">
                        <a href="#" className="text-facebook-blue hover:underline text-sm">
                          Forgotten password?
                        </a>
                      </div>

                      {/* Divider */}
                      <div className="flex items-center my-6">
                        <Separator className="flex-1" />
                        <span className="px-4 text-facebook-muted text-sm">or</span>
                        <Separator className="flex-1" />
                      </div>

                      {/* Social Login Buttons */}
                      <div className="space-y-3">
                        <Button
                          type="button"
                          onClick={() => handleSocialLogin("Facebook")}
                          className="w-full bg-facebook-blue hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center gap-2"
                        >
                          <SiFacebook />
                          Continue with Facebook
                        </Button>

                        <Button
                          type="button"
                          onClick={() => handleSocialLogin("Google")}
                          className="w-full bg-white border border-facebook-border hover:bg-gray-50 text-facebook-text font-medium py-3 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center gap-2"
                        >
                          <SiGoogle className="text-red-500" />
                          Continue with Google
                        </Button>

                        <Button
                          type="button"
                          onClick={() => handleSocialLogin("Apple")}
                          className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center gap-2"
                        >
                          <SiApple />
                          Continue with Apple
                        </Button>
                      </div>

                      {/* Create Account Button */}
                      <div className="border-t border-facebook-border pt-4 mt-6">
                        <Button
                          type="button"
                          className="w-full bg-facebook-success hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-md transition duration-200 ease-in-out"
                        >
                          Create new account
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {/* Mobile Brand Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 facebook-blue text-[#d91c1f]">BloodSource</h1>
              <p className="text-facebook-text text-lg sm:text-xl font-normal leading-6 px-4">
                Facebook helps you connect and share with the people in your life.
              </p>
            </div>

            {/* Mobile Login Section */}
            <div className="w-full max-w-sm mx-auto">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      {/* Username/Email Input */}
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-facebook-muted w-4 h-4" />
                                <Input
                                  placeholder="Email or phone"
                                  className="pl-10 pr-4 py-4 bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent text-base min-h-[44px]"
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
                                  className="pl-10 pr-12 py-4 bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent text-base min-h-[44px]"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-facebook-muted min-w-[44px] min-h-[44px] flex items-center justify-center"
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

                      {/* Login Button */}
                      <Button
                        type="submit"
                        className="w-full bg-[#d91c1f] hover:bg-red-700 text-[#ffffff] font-semibold py-4 px-4 rounded-md transition duration-200 ease-in-out min-h-[44px]"
                      >
                        Log in
                      </Button>

                      {/* Forgot Password Link */}
                      <div className="text-center">
                        <a href="#" className="text-facebook-blue hover:underline text-sm min-h-[44px] inline-block py-2">
                          Forgotten password?
                        </a>
                      </div>

                      {/* Divider */}
                      <div className="flex items-center my-6">
                        <Separator className="flex-1" />
                        <span className="px-4 text-facebook-muted text-sm">or</span>
                        <Separator className="flex-1" />
                      </div>

                      {/* Social Login Buttons */}
                      <div className="space-y-3">
                        <Button
                          type="button"
                          onClick={() => handleSocialLogin("Facebook")}
                          className="w-full bg-facebook-blue hover:bg-blue-600 text-white font-medium py-4 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center gap-2 min-h-[44px]"
                        >
                          <SiFacebook />
                          Continue with Facebook
                        </Button>

                        <Button
                          type="button"
                          onClick={() => handleSocialLogin("Google")}
                          className="w-full bg-white border border-facebook-border hover:bg-gray-50 text-facebook-text font-medium py-4 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center gap-2 min-h-[44px]"
                        >
                          <SiGoogle className="text-red-500" />
                          Continue with Google
                        </Button>

                        <Button
                          type="button"
                          onClick={() => handleSocialLogin("Apple")}
                          className="w-full bg-black hover:bg-gray-800 text-white font-medium py-4 px-4 rounded-md transition duration-200 ease-in-out flex items-center justify-center gap-2 min-h-[44px]"
                        >
                          <SiApple />
                          Continue with Apple
                        </Button>
                      </div>

                      {/* Create Account Button */}
                      <div className="border-t border-facebook-border pt-4 mt-6">
                        <Button
                          type="button"
                          className="w-full bg-facebook-success hover:bg-green-600 text-white font-semibold py-4 px-4 rounded-md transition duration-200 ease-in-out min-h-[44px]"
                        >
                          Create new account
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      {/* X.com-style Minimal Footer */}
      <footer className="bg-white border-t border-facebook-border py-4 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Desktop Footer */}
          <div className="hidden sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-1 text-facebook-muted text-xs">
              <a href="#" className="hover:text-facebook-text transition-colors">About</a>
              <span>,</span>
              <a href="#" className="hover:text-facebook-text transition-colors">English</a>
              <span>,</span>
              <a href="#" className="hover:text-facebook-text transition-colors">Bangla</a>
              <span>,</span>
              <a href="#" className="hover:text-facebook-text transition-colors">Privacy</a>
              <span>,</span>
              <a href="#" className="hover:text-facebook-text transition-colors">Terms</a>
              <span>,</span>
              <a href="#" className="hover:text-facebook-text transition-colors">Help Center</a>
              <span>,</span>
              <a href="#" className="hover:text-facebook-text transition-colors">Developers</a>
              <span>,</span>
              <a href="#" className="hover:text-facebook-text transition-colors">Advertising</a>
              <span>,</span>
              <a href="#" className="hover:text-facebook-text transition-colors">Settings</a>
            </div>
            <div className="text-facebook-muted text-xs">Modhu copyright 2025</div>
          </div>

          {/* Mobile Footer */}
          <div className="sm:hidden">
            <div className="flex flex-wrap justify-center items-center gap-x-1 gap-y-2 text-facebook-muted text-xs mb-2">
              <a href="#" className="hover:text-facebook-text transition-colors">About</a>
              <span>,</span>
              <a href="#" className="hover:text-facebook-text transition-colors">English</a>
              <span>,</span>
              <a href="#" className="hover:text-facebook-text transition-colors">Bangla</a>
              <span>,</span>
              <a href="#" className="hover:text-facebook-text transition-colors">Privacy</a>
              <span>,</span>
              <a href="#" className="hover:text-facebook-text transition-colors">Terms</a>
              <span>,</span>
              <a href="#" className="hover:text-facebook-text transition-colors">Help Center</a>
              <span>,</span>
              <a href="#" className="hover:text-facebook-text transition-colors">Developers</a>
              <span>,</span>
              <a href="#" className="hover:text-facebook-text transition-colors">Advertising</a>
              <span>,</span>
              <a href="#" className="hover:text-facebook-text transition-colors">Settings</a>
            </div>
            <div className="text-center text-facebook-muted text-xs">
              modhu copyright 2025
            </div>
          </div>
        </div>
      </footer>
      <FloatingAIButton />
    </div>
  );
}
