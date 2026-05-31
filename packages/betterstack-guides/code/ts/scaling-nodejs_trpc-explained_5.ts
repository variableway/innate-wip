# Source: https://betterstack.com/community/guides/scaling-nodejs/trpc-explained/
# Original language: typescript
# Normalized: ts
# Block index: 5

[label src/index.ts]
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import { z } from 'zod';

// Mock database - in a real app, you'd use a real database
let users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' },
];

// Define validation schema with Zod
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email format'),
});

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Validation middleware using Zod
const validateRequest = (schema: z.ZodType<any, any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
};

// POST - Create a new user
app.post('/api/users', validateRequest(userSchema), (req, res) => {
  const { name, email } = req.body;
  
  // Check for duplicate email
  if (users.some(user => user.email === email)) {
    res.status(409).json({ 
      error: 'A user with this email already exists'
    });
    return;
  }
  
  // Create new user
  const newUser = {
    id: String(users.length + 1), // Simple ID generation
    name,
    email
  };
  
  // Save to our mock database
  users.push(newUser);
  
  // Return the newly created user with 201 Created status
  res.status(201).json(newUser);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});