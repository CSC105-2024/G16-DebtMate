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
      // Check if user data exists and isLoggedIn is true
      const userStr = localStorage.getItem("currentUser");
      const isLoggedIn = localStorage.getItem("isLoggedIn") !== "false";

      // Set authentication state based on both conditions
      setIsAuthenticated(Boolean(userStr) && isLoggedIn);

      // No need to check with backend if user is not logged in
      if (!isLoggedIn) {
        setIsLoading(false);
        return false;
      }

      setIsLoading(false);
      return Boolean(userStr) && isLoggedIn;
    } catch (error) {
      console.error("Auth check failed:", error);
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
