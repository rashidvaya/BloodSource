import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from './use-toast';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roleId: string; // Added for role-based redirects
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAuthState({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success && data.user) {
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.user.username}!`,
        });
        
        return { success: true };
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
        
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      
      return { success: false, message: "Network error" };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        
        navigate('/');
      } else {
        toast({
          title: "Logout failed",
          description: "Something went wrong during logout.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout error",
        description: "Something went wrong during logout.",
        variant: "destructive",
      });
    }
  };

  const signup = async (userData: any) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success && data.user) {
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        toast({
          title: "Account created successfully",
          description: "Welcome to BloodSource! You can now log in.",
        });
        
        return { success: true };
      } else {
        toast({
          title: "Signup failed",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
        
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      
      return { success: false, message: "Network error" };
    }
  };

  return {
    ...authState,
    login,
    logout,
    signup,
    checkAuthStatus,
  };
} 