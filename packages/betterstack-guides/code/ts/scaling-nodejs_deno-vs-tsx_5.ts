# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-tsx/
# Original language: typescript
# Normalized: ts
# Block index: 5

// Deno URL imports with explicit versions
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import express from "npm:express@4.18.2"; // npm compatibility layer