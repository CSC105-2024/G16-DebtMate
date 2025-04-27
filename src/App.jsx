import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// importing pages and components for routing
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
import { Group, Settings } from "lucide-react";
import SettingsPage from "./pages/SettingsPage";
import AddItems from "./pages/AddItems";
import SplitBill from "./pages/SplitBill";
import GroupForm from "./pages/GroupForm";
import UserInformation from "./pages/UserInformation";
import UserInformationEdit from "./pages/UserInformationEdit";

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
      element: <GroupForm />,
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
      element: <GroupForm />,
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
      path: "/groups",
      element: <GroupList />,
    },
    {
      path: "/settings",
      element: <SettingsPage />,
    },
    {
      path: "/groups/:groupId/items/add",
      element: <AddItems />,
    },
    {
      path: "/groups/:groupId/split",
      element: <SplitBill />,
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
