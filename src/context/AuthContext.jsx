import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  checkAuth: () => Promise.resolve(),
});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      // quick check in localStorage first for faster initial state
      const userStr = localStorage.getItem("currentUser");
      const initialAuth = !!userStr;
      setIsAuthenticated(initialAuth);

      // if nobody's logged in, no need to check with the server
      if (!initialAuth) {
        setIsLoading(false);
        return false;
      }

      // double-check with the backend to make sure the session is still valid
      const response = await fetch("http://localhost:3000/api/me", {
        credentials: "include", // gotta send the cookie
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        return true;
      } else {
        // oops, token expired or invalid - clear local storage
        localStorage.removeItem("currentUser");
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // if the server's down, just go with what we have in localStorage
      return !!localStorage.getItem("currentUser");
    } finally {
      setIsLoading(false);
    }
  };

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
