# Source: https://betterstack.com/community/guides/scaling-nodejs/satisfies-operator/
# Original language: typescript
# Normalized: ts
# Block index: 15

[label src/routes.ts]
...
const routes = {
  home: () => console.log("Home page"),
  users: {
    GET: () => console.log("List users"),
    POST: () => console.log("Create user"),
  },
  about: () => console.log("About page"),
[highlight]
  invalid: { PUT: () => console.log("Invalid") },
[/highlight]
} satisfies RouteMap;
...