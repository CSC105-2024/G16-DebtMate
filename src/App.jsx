// TODO: Add protected routes once auth is implemented
// TODO: Add a 404 page

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

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
      path: "*",
      element: <NotFound />,
    }
  ]);

  return (
    <div className="app-container">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
