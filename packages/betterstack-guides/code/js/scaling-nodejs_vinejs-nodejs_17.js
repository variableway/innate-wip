# Source: https://betterstack.com/community/guides/scaling-nodejs/vinejs-nodejs/
# Original language: javascript
# Normalized: js
# Block index: 17

[label index.js]
import express from "express";
import vine from "@vinejs/vine";

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

[highlight]
// Define a schema with nested object and array validation
const schema = vine.object({
  name: vine.string().trim().minLength(2).maxLength(50),
  email: vine.string().email().normalizeEmail(),
  password: vine
    .string()
    .minLength(8)
    .maxLength(100)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),

  password_confirmation: vine.string(),
[highlight]
  address: vine.object({
    street: vine.string().minLength(3),
    city: vine.string().minLength(2),
    zip: vine.string().regex(/^\d{5}$/)
  }),
  skills: vine.array(vine.string().minLength(2)).minLength(1)
[/highlight]

});
...