/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSigningUp: boolean; // Add this
  isLoggingIn: boolean; // Add this for consistency
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false); // Add this
  const [isLoggingIn] = useState(false); // Add this
  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
      // Set default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Replace with your actual API endpoint
      const response = await axios.post(
        "http://localhost:8000/v-1/application/auth/login",
        {
          email,
          password,
        }
      );

      const { access_token: token, user: userData } = response.data;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      // Set default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsSigningUp(true); // Use specific state for signup

      // Replace with your actual API endpoint
      const response = await axios.post(
        "http://localhost:8000/v-1/application/auth/signup",
        {
          name,
          email,
          password,
        }
      );

      console.log("Signup successful:", response.data);

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isLoading, // This is for initial app loading
    isSigningUp, // This is for signup operation
    isLoggingIn, // This is for login operation
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
