# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 35

bindings: (bindings) => {
  return {
    pid: bindings.pid,
    host: bindings.hostname,
    [highlight]
    node_version: process.version,
    [/highlight]
  };
},