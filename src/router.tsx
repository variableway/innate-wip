import {
  Outlet,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router"
import { WritingPage } from "./pages/writing/page"
import { WritingDetailPage } from "./pages/writing/[slug]/page"

function RootLayout() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <Outlet />
    </div>
  )
}

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: WritingPage,
})

const writingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/writing",
  component: WritingPage,
})

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/landing",
  component: WritingPage,
})

const writingSlugRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/writing/$slug",
  component: WritingDetailPage,
})

const slugRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/$slug",
  component: WritingDetailPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  writingRoute,
  landingRoute,
  writingSlugRoute,
  slugRoute,
])

export const router = createRouter({
  routeTree,
  history: createHashHistory(),
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
