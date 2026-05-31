# Source: https://betterstack.com/community/guides/scaling-nodejs/ory-kratos/
# Original language: typescript
# Normalized: ts
# Block index: 11

[label middleware.ts]
import { createOryMiddleware } from "@ory/nextjs/middleware";
import oryConfig from "./ory.config";

export const middleware = createOryMiddleware(oryConfig);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};