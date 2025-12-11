/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const [token, setToken] = useState<string | null>(null);

  const clearAuthData = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
  };

  const handleAutomaticLogout = async (errorMessage: string) => {
    const currentToken = sessionStorage.getItem("token");

    if (currentToken) {
      try {
        await axios.post(
          "http://localhost:8000/v-1/application/auth/log-automatic-logout",
          {
            token: currentToken,
            reason: errorMessage.includes("Token expired")
              ? "token_expired"
              : "invalid_credentials",
          }
        );
      } catch (error) {
        console.log(
          "Automatic logout logging failed (expected for expired tokens)"
        );
      }
    }

    clearAuthData();

    if (
      !window.location.pathname.includes("/signin") &&
      !window.location.pathname.includes("/signup")
    ) {
      window.location.href = "/signin";
    }
  };

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
              handleAutomaticLogout(errorMessage);
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

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");

    if (storedToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setToken(storedToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error("Error parsing user data:", error);
        clearAuthData();
      }
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

      const { access_token: newToken, user: userData } = response.data;

      sessionStorage.setItem("token", newToken);
      sessionStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setToken(newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

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

      const { access_token: newToken, user: userData } = response.data;

      sessionStorage.setItem("token", newToken);
      sessionStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setToken(newToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || "Signup failed");
    } finally {
      setIsSigningUp(false);
    }
  };

  const logout = async () => {
    try {
      const currentToken = sessionStorage.getItem("token");
      if (currentToken) {
        await axios.post(
          "http://localhost:8000/v-1/application/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
          }
        );
      }
    } catch (error) {
      console.log("Logout endpoint failed, but clearing local storage anyway");
    } finally {
      clearAuthData();
      window.location.href = "/signin";
    }
  };

  const getToken = () => {
    return token || sessionStorage.getItem("token");
  };

  const getUserEmail = () => {
    return (
      user?.email || JSON.parse(sessionStorage.getItem("user") || "{}")?.email
    );
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
    getToken,
    getUserEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
