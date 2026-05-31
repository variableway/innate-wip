# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 47

[label src/middleware/error.js]
import logger from "../config/logger.js";

function errorHandler(err, req, reply) {
  let statusCode = 500;
  let message = "internal server error";

  if (err.code === "FST_ERR_VALIDATION") {
    statusCode = 400;
    message = "validation error";
    logger.info(err);
  } else {
    logger.error(err);
  }

  const response = {
    code: statusCode,
    message,
  };

  reply.code(statusCode).send(response);
}

export default errorHandler;