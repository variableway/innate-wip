# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-vs-deno-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 12

// Deno import patterns
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { readFile } from "node:fs/promises"; // Node.js compatibility