# Source: https://betterstack.com/community/guides/scaling-nodejs/satisfies-operator/
# Original language: typescript
# Normalized: ts
# Block index: 12

[label src/routes.ts]
type RouteHandler = (() => void) | { GET?: () => void; POST?: () => void };

type RouteMap = Record<string, RouteHandler>;

// satisfies validates all handlers while preserving exact types
const routes = {
  home: () => console.log("Home page"),
  users: {
    GET: () => console.log("List users"),
    POST: () => console.log("Create user"),
  },
  about: () => console.log("About page"),
} satisfies RouteMap;

// TypeScript knows home is a function
routes.home();

// TypeScript knows users is an object with GET/POST
routes.users.GET?.();
routes.users.POST?.();

// Can check which type each route has
if (typeof routes.about === "function") {
  routes.about();
}