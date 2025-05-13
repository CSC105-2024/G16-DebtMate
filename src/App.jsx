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
import GroupList from "./pages/GroupList";
import ItemList from "./pages/ItemList";
import SettingsPage from "./pages/SettingsPage";
import AddItems from "./pages/AddItems";
import SplitBill from "./pages/SplitBill";
import GroupForm from "./pages/GroupForm";
import EditItem from "./pages/EditItem";
import UserInformation from "./pages/UserInformation";
import UserInformationEdit from "./pages/UserInformationEdit";

import { AuthProvider, useAuth } from "./context/AuthContext";

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-twilight font-bold text-xl">Loading...</div>
      </div>
    );
  }

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
          <GroupForm />
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
      path: "/edit-group/:groupId",
      element: (
        <ProtectedRoute>
          <GroupForm />
        </ProtectedRoute>
      ),
    },
    {
      path: "/groups/:groupId/items/:itemId/edit",
      element: (
        <ProtectedRoute>
          <EditItem />
        </ProtectedRoute>
      ),
    },
    {
      path: "/user-info",
      element: (
        <ProtectedRoute>
          <UserInformation />
        </ProtectedRoute>
      ),
    },
    {
      path: "/user-info-edit",
      element: (
        <ProtectedRoute>
          <UserInformationEdit />
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "/settings",
      element: (
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/groups/:groupId/items/add",
      element: (
        <ProtectedRoute>
          <AddItems />
        </ProtectedRoute>
      ),
    },
    {
      path: "/groups/:groupId/split",
      element: (
        <ProtectedRoute>
          <SplitBill />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
