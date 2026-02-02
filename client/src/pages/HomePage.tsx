import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { SiFacebook, SiGoogle, SiApple } from "react-icons/si";
import FloatingAIButton from "@/components/FloatingAIButton";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, type LoginRequest } from "@shared/schema";
import NewsfeedPage from './NewsfeedPage';
import AdminDashboardPage from './AdminDashboardPage';

type LoginForm = LoginRequest;

export default function HomePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [, navigate] = useLocation();
  const { login, isAuthenticated, isLoading, user } = useAuth();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    const result = await login(data);
    if (result.success && user) {
      if (user.roleId === 'staff') {
        navigate('/admin-dashboard');
      } else {
        navigate('/newsfeed');
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Social login implementation would go here
    console.log(`${provider} login clicked`);
  };

  // If user is already authenticated, redirect to dashboard or home
  if (isAuthenticated && !isLoading && user) {
    if (user.roleId === 'staff') {
      navigate('/admin-dashboard');
    } else {
      navigate('/newsfeed');
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-facebook-gray">
      <main className="flex-1 flex items-center justify-center px-4 py-8 lg:py-0">
        <div className="w-full max-w-6xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Brand Section */}
            <div className="text-left">
              <div className="mb-4">
                <h1 className="text-6xl font-bold tracking-tight text-[#d91c1f]">
                  BloodSource
                </h1>
              </div>
              <p className="text-facebook-text text-2xl font-normal leading-8 max-w-lg">
                BloodSource helps you connect and share with the people in your life.
              </p>
            </div>

            {/* Login Section */}
            <div className="w-full max-w-md mx-auto">
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center mb-6 hidden lg:block">
                    <h2 className="text-2xl font-semibold text-facebook-text mb-1">Hi, Welcome Back 👋</h2>
                    <p className="text-facebook-muted text-base">It's great to see you again.</p>
                  </div>
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
                                  placeholder="Username"
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
                                  className="pl-10 pr-14 py-3 bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-facebook-muted min-w-[44px] min-h-[44px] flex items-center justify-center"
                                  onClick={() => setShowPassword(!showPassword)}
                                  aria-label={showPassword ? "Hide password" : "Show password"}
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
                        disabled={isLoading}
                        className="w-full bg-[#d91c1f] hover:bg-red-700 text-[#ffffff] font-semibold py-3 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105 disabled:opacity-50"
                      >
                        {isLoading ? "Logging in..." : "Log in"}
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
                          onClick={() => navigate("/signup")}
                          className="w-full bg-facebook-success hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
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
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-[#d91c1f]">BloodSource</h1>
              <p className="text-facebook-text text-lg sm:text-xl font-normal leading-6 px-4">
                BloodSource helps you connect and share with the people in your life.
              </p>
            </div>

            {/* Mobile Login Section */}
            <div className="w-full max-w-sm mx-auto">
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-facebook-text mb-1">Hi, Welcome Back 👋</h2>
                    <p className="text-facebook-muted text-base">It's great to see you again.</p>
                  </div>
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
                                  placeholder="Username"
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
                                  className="pl-10 pr-14 py-4 bg-facebook-gray border-facebook-border focus:ring-2 focus:ring-facebook-blue focus:border-transparent text-base min-h-[44px]"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  className="absolute right-1 top-1/2 transform -translate-y-1/2 text-facebook-muted min-w-[44px] min-h-[44px] flex items-center justify-center"
                                  onClick={() => setShowPassword(!showPassword)}
                                  aria-label={showPassword ? "Hide password" : "Show password"}
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
                        disabled={isLoading}
                        className="w-full bg-[#d91c1f] hover:bg-red-700 text-[#ffffff] font-semibold py-4 px-4 rounded-md transition duration-200 ease-in-out min-h-[44px] disabled:opacity-50"
                      >
                        {isLoading ? "Logging in..." : "Log in"}
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
                          onClick={() => navigate("/signup")}
                          className="w-full bg-facebook-success hover:bg-green-600 text-white font-semibold py-4 px-4 rounded-md transition duration-200 ease-in-out min-h-[44px] transform hover:scale-105"
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
      <FloatingAIButton />
    </div>
  );
}
