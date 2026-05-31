# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: typescript
# Normalized: ts
# Block index: 18

import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

interface UserRequest extends Request {
  query: {
    username: string;
    email?: string;
  };
}

app.get("/", (req: UserRequest, res: Response) => {
  const { username, email } = req.query;
  res
    .status(200)
    .send(`Hello, ${username}! ${email ? `Your email is ${email}.` : ""}`);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));