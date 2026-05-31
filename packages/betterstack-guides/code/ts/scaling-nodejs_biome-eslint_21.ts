# Source: https://betterstack.com/community/guides/scaling-nodejs/biome-eslint/
# Original language: typescript
# Normalized: ts
# Block index: 21

// packages/backend/src/api.ts
import { Request, Response } from 'express';
import { getUserById } from './db';

export async function handleUserRequest(req: Request, res: Response) {
  const userId = req.params.id;
  
  // ESLint error: Promise not handled
  getUserById(userId);
  
  res.json({ status: 'ok' });
}