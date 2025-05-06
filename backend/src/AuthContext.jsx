import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create the authentication context
const AuthContext = createContext();

// Base URL for API requests
axios.defaults.baseURL = "http://localhost:3000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if the user is authenticated on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("/api/me", {
          withCredentials: true,
        });

        if (response.data.success && response.data.isAuthenticated) {
          setIsAuthenticated(true);

          // Get user details if authenticated
          try {
            const userResponse = await axios.get("/api/users/me", {
              withCredentials: true,
            });
            if (userResponse.data.success) {
              setUser(userResponse.data.user);
            }
          } catch (error) {
            console.error("Failed to fetch user details:", error);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await axios.post("/api/auth/login", credentials, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return {
        success: false,
        message: response.data.message || "Login failed",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Network error. Please try again.",
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await axios.post("/api/auth/register", userData, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return {
        success: false,
        message: response.data.message || "Registration failed",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Network error. Please try again.",
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
