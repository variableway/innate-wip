# Source: https://betterstack.com/community/guides/scaling-nodejs/migrating-from-express-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 11

// Express route organization
import express from 'express';
const userRouter = express.Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUser);
userRouter.post('/', createUser);

app.use('/api/users', userRouter);