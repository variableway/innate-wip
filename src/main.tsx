import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { ThemeProvider } from "@innate/ui"
import { router } from "./router"

import "@innate/ui/globals.css"
import "./globals.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <div className="h-svh overflow-hidden">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  </StrictMode>
)
