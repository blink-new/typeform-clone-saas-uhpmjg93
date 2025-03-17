import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user type
export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'business';
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for local authentication
const MOCK_USER: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@formflow.com',
  plan: 'free',
};

// Create the auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('formflow_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    // Simulate API call
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll accept any email/password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set the user
      setUser(MOCK_USER);
      
      // Store in localStorage for persistence
      localStorage.setItem('formflow_user', JSON.stringify(MOCK_USER));
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll just create a new user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        ...MOCK_USER,
        name,
        email,
      };
      
      // Set the user
      setUser(newUser);
      
      // Store in localStorage for persistence
      localStorage.setItem('formflow_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Signup failed:', error);
      throw new Error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('formflow_user');
  };

  // Create the context value
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}