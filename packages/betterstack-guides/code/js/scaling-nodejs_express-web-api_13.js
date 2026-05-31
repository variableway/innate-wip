# Source: https://betterstack.com/community/guides/scaling-nodejs/express-web-api/
# Original language: javascript
# Normalized: js
# Block index: 13

[label validators/post.js]
...
// Validate query parameters
const validatePostQuery = [
  query('published')
    .optional()
    .isBoolean()
    .withMessage('Published query parameter must be a boolean')
    .toBoolean(),
  validateResults
];

// Validate post ID parameter
const validatePostId = [
  param('id')
    .isUUID(4)
    .withMessage('Post ID must be a valid UUID'),
  validateResults
];

export { validatePost, validatePostQuery, validatePostId };