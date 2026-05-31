# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 14

import express from 'express';
import Joi from 'joi';

const app = express();
app.use(express.json());

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  age: Joi.number().min(18).optional(),
});

app.post('/user', (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  ...
});
...