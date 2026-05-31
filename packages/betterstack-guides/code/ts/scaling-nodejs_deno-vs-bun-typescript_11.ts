# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-bun-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 11

// deps.ts - TypeScript dependencies via URLs
export { serve } from "https://deno.land/std@0.208.0/http/server.ts";
export { assertEquals } from "https://deno.land/std@0.208.0/testing/asserts.ts";

// External npm packages with types
// @ts-types="npm:@types/express"
import express from "npm:express";