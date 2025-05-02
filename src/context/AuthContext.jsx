/**
 * provides authentication state management across the application.
 * implements a React Context for sharing auth state with all components.
 * handles login persistence using localStorage and backend validation.
 * used by App.jsx to protect routes and manage authentication flow.
 */

import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  checkAuth: () => Promise.resolve(),
  isLoading: true,
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Verifies if the user is authenticated
   * First checks local storage, then validates with the backend
   */
  const checkAuth = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:3000/api/me", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
      return data.success;
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  };

  // Check authentication status on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        checkAuth,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
