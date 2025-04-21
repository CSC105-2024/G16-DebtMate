import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./App.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import FriendList from "./pages/FriendList";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

function AppRoutes() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // quick little wrapper to handle auth protection
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: isAuthenticated ? (
        <Navigate to="/friendlist" replace />
      ) : (
        <SignUp />
      ),
    },
    {
      path: "/signup",
      element: isAuthenticated ? (
        <Navigate to="/friendlist" replace />
      ) : (
        <SignUp />
      ),
    },
    {
      path: "/login",
      element: isAuthenticated ? (
        <Navigate to="/friendlist" replace />
      ) : (
        <Login />
      ),
    },
    {
      path: "/friendlist",
      element: (
        <ProtectedRoute>
          <FriendList />
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <div className="app-container">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}

export default App;
