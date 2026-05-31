# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-timeouts/
# Original language: javascript
# Normalized: js
# Block index: 6

function setTimeoutOnRequest(request, reply, timeoutMs) {
  request.controller = new AbortController();
  request.signal = request.controller.signal;

  reply.raw.setTimeout(timeoutMs, () => {
    request.controller.abort();
    reply.code(408).send(new Error('Request Timedout'));
  });
}

fastify.get('/', async (request, reply) => {
  setTimeoutOnRequest(request, reply, 20000);
  // rest of the handler
});