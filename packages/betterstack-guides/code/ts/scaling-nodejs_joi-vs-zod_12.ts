# Source: https://betterstack.com/community/guides/scaling-nodejs/joi-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 12

import express from 'express';
import Joi from 'joi';
import { celebrate, Segments } from 'celebrate';

const app = express();

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required()
});

app.post('/users',
  celebrate({ [Segments.BODY]: userSchema }),
  (req, res) => {
    const user = req.body;
    res.status(201).json({ id: 'new-user-id', ...user });
  }
);

app.use((err, req, res, next) => {
  if (err.joi) {
    return res.status(400).json({ error: err.joi.message });
  }
  next(err);
});