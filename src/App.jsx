// TODO: Add protected routes once auth is implemented
// TODO: Add a 404 page

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import FriendList from "./pages/FriendList";
import GroupList from "./pages/GroupList";
import { Group } from "lucide-react";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SignUp />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/friends",
      element: <FriendList />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "/groups",
      element: <GroupList />,
    }
  ]);

  return (
    <div className="app-container bg-pale">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
