/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import type { AuthContextType, AuthProviderProps, User } from "../common/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Function to clear auth data
  const clearAuthData = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // Setup axios interceptor to handle token expiration
  useEffect(() => {
    const setupInterceptors = () => {
      const interceptor = axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            const errorMessage = error.response?.data?.detail || "";

            if (
              errorMessage.includes("Token expired") ||
              errorMessage.includes("Invalid authentication credentials")
            ) {
              // Clear auth data
              clearAuthData();

              // Redirect to login if not already there
              if (
                !window.location.pathname.includes("/signin") &&
                !window.location.pathname.includes("/signup")
              ) {
                window.location.href = "/signin";
              }
            }
          }
          return Promise.reject(error);
        }
      );

      return () => {
        axios.interceptors.response.eject(interceptor);
      };
    };

    setupInterceptors();
  }, []);

  // Initialize auth state
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");

    if (token && userData) {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoggingIn(true);

      const response = await axios.post(
        "http://localhost:8000/v-1/application/auth/login",
        {
          email,
          password,
        }
      );

      const { access_token: token, user: userData } = response.data;

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return userData;
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: string,
    profileImage?: string
  ) => {
    try {
      setIsSigningUp(true);

      const response = await axios.post(
        "http://localhost:8000/v-1/application/auth/signup",
        {
          name,
          email,
          password,
          role,
          profile_image: profileImage,
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Signup failed");
    } finally {
      setIsSigningUp(false);
    }
  };

  const logout = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        // Try to call logout endpoint, but don't fail if it doesn't work
        await axios
          .post(
            "http://localhost:8000/v-1/application/auth/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .catch(() => {
            // Ignore errors - we still want to clear local storage
          });
      }
    } finally {
      clearAuthData();
      // Redirect to login page
      window.location.href = "/signin";
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isLoading,
    isSigningUp,
    isLoggingIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
