# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 29

[label when-satisfies.ts]
const routes = {
  home: "/",
  about: "/about",
  contact: "/contact"
} satisfies Record<string, string>;

routes.home; // Type: "/" (not string)