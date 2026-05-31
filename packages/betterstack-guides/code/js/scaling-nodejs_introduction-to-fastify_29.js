# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 29

[label src/controllers/createPost.controller.js]
import slugify from "slugify";
[highlight]
import Ajv from "ajv";

const ajv = new Ajv();

// Define the schema for post data
const postSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      minLength: 1,
      maxLength: 100,
      pattern: "^(?=.*[a-zA-Z]).+$",
    },
    content: { type: "string", minLength: 1 },
  },
  required: ["title", "content"],
  additionalProperties: false,
};

const validatePost = ajv.compile(postSchema);
[/highlight]

export function getNewPost(request, reply) {
  return reply.view("new", { title: "Create New Post" });
}

export function createPost(request, reply) {
  const { title, content } = request.body;

[highlight]
  // Validate the input
  const valid = validatePost({ title, content });
  if (!valid) {
    return reply.status(400).send({
      error: "Invalid input",
      details: validatePost.errors,
    });
  }
[/highlight]

  const slug = slugify(title, { lower: true, strict: true });

  const { db } = request.server;

  const insertStatement = db.prepare(
    "INSERT INTO posts (title, slug, content) VALUES (?, ?, ?)"
  );
  insertStatement.run(title, slug, content);

  return reply.redirect("/");
}