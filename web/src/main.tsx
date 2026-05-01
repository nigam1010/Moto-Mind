import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App"
import Home from "./pages/Home"
import Models from "./pages/Models"
import ModelDetails from "./pages/ModelDetails"
import Configurator from "./pages/Configurator"
import "./index.css"
import Garage from "./pages/Garage"
import Login from "./pages/Login" // we'll add next step
import { UserProvider } from "./UserContext"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "models", element: <Models /> },
      { path: "models/:slug", element: <ModelDetails /> },
      { path: "configure/:slug", element: <Configurator /> },
      { path: "garage", element: <Garage /> },
      { path: "login", element: <Login /> }, // temp route
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
)
