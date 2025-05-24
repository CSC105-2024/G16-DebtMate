import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
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

// ProtectedRoute will be used for each protected route
function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-twilight font-bold text-xl">Loading...</div>
      </div>
    );
  }

  // If authenticated, render child routes, otherwise redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

// Public route redirects to friendlist if already authenticated
function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-twilight font-bold text-xl">Loading...</div>
      </div>
    );
  }

  // If authenticated, redirect to friendlist, otherwise render child routes
  return isAuthenticated ? <Navigate to="/friendlist" replace /> : <Outlet />;
}

function AppRoutes() {
  // Create the router with authentication logic built into the routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicRoute />,
      children: [
        { index: true, element: <SignUp /> },
        { path: "signup", element: <SignUp /> },
        { path: "login", element: <Login /> },
      ],
    },
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        { path: "friendlist", element: <FriendList /> },
        { path: "add-friend", element: <AddFriends /> },
        { path: "groups", element: <GroupList /> },
        { path: "create-group", element: <GroupForm /> },
        { path: "groups/:groupId/items", element: <ItemList /> },
        { path: "edit-group/:groupId", element: <GroupForm /> },
        { path: "groups/:groupId/items/:itemId/edit", element: <EditItem /> },
        { path: "user-info", element: <UserInformation /> },
        { path: "user-info-edit", element: <UserInformationEdit /> },
        { path: "settings", element: <SettingsPage /> },
        { path: "groups/:groupId/items/add", element: <AddItems /> },
        { path: "groups/:groupId/split", element: <SplitBill /> },
      ],
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
    <AuthProvider>
      <div className="app-container">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
