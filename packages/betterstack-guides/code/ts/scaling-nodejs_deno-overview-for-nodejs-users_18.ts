# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-overview-for-nodejs-users/
# Original language: typescript
# Normalized: ts
# Block index: 18

import { serve } from "https://deno.land/std@0.196.0/http/server.ts";
serve((req) => new Response("Hello Deno!"), { port: 8000 });