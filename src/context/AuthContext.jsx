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
   * @returns {Promise<boolean>} Authentication status
   */
  const checkAuth = async () => {
    try {
      // Check localStorage first for faster initial state
      const userStr = localStorage.getItem("currentUser");
      const initialAuth = Boolean(userStr);
      setIsAuthenticated(initialAuth);

      // Skip server check if not logged in
      if (!initialAuth) {
        setIsLoading(false);
        return false;
      }

      // Verify with backend
      const response = await fetch("http://localhost:3000/api/me", {
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        return true;
      }

      // Invalid session - clear storage
      localStorage.removeItem("currentUser");
      setIsAuthenticated(false);
      return false;
    } catch (error) {
      console.error("Auth check failed:", error);
      return Boolean(localStorage.getItem("currentUser"));
    } finally {
      setIsLoading(false);
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
