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
import AddFriends from "./pages/AddFriends";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import GroupList from "./pages/GroupList";
import CreateGroup from "./pages/CreateGroup";
import ItemList from "./pages/ItemList";
import AddMember from "./Component/AddMember";

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
      path: "/add-friend",
      element: (
        <ProtectedRoute>
          <AddFriends />
        </ProtectedRoute>
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
      path: "/groups",
      element: (
        <ProtectedRoute>
          <GroupList />
        </ProtectedRoute>
      ),
    },
    {
      path: "/create-group",
      element: (
        <ProtectedRoute>
          <CreateGroup />
        </ProtectedRoute>
      ),
    },
    {
      path: "/groups/:groupId/items",
      element: (
        <ProtectedRoute>
          <ItemList />
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
