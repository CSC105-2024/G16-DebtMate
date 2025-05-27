import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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
import PageTransition from "./Component/PageTransition";

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

function AnimatedRoutes() {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-twilight font-bold text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes - redirect if authenticated */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/friendlist" replace /> : <PageTransition><SignUp /></PageTransition>}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/friendlist" replace /> : <PageTransition><Login /></PageTransition>}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/friendlist" replace /> : <PageTransition><SignUp /></PageTransition>}
        />
        
        <Route
          path="/friendlist"
          element={isAuthenticated ? <PageTransition><FriendList /></PageTransition> : <Navigate to="/login" replace />}
        />
        <Route
          path="/add-friend"
          element={isAuthenticated ? <PageTransition><AddFriends /></PageTransition> : <Navigate to="/login" replace />}
        />
        <Route
          path="/groups"
          element={isAuthenticated ? <PageTransition><GroupList /></PageTransition> : <Navigate to="/login" replace />}
        />
        <Route
          path="/create-group"
          element={isAuthenticated ? <PageTransition><GroupForm /></PageTransition> : <Navigate to="/login" replace />}
        />
        <Route
          path="/groups/:groupId/items"
          element={isAuthenticated ? <PageTransition><ItemList /></PageTransition> : <Navigate to="/login" replace />}
        />
        <Route
          path="/edit-group/:groupId"
          element={isAuthenticated ? <PageTransition><GroupForm /></PageTransition> : <Navigate to="/login" replace />}
        />
        <Route
          path="/groups/:groupId/items/:itemId/edit"
          element={isAuthenticated ? <PageTransition><EditItem /></PageTransition> : <Navigate to="/login" replace />}
        />
        <Route
          path="/user-info"
          element={isAuthenticated ? <PageTransition><UserInformation /></PageTransition> : <Navigate to="/login" replace />}
        />
        <Route
          path="/user-info-edit"
          element={isAuthenticated ? <PageTransition><UserInformationEdit /></PageTransition> : <Navigate to="/login" replace />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <PageTransition><SettingsPage /></PageTransition> : <Navigate to="/login" replace />}
        />
        <Route
          path="/groups/:groupId/items/add"
          element={isAuthenticated ? <PageTransition><AddItems /></PageTransition> : <Navigate to="/login" replace />}
        />
        <Route
          path="/groups/:groupId/split"
          element={isAuthenticated ? <PageTransition><SplitBill /></PageTransition> : <Navigate to="/login" replace />}
        />
        
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
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
        {/* <AppRoutes /> */}

        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
        
      </div>
    </AuthProvider>
  );
}

export default App;
