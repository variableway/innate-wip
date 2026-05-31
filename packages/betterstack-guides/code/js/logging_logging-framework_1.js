# Source: https://betterstack.com/community/guides/logging/logging-framework/
# Original language: javascript
# Normalized: js
# Block index: 1

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

const logger = winston.createLogger({
  levels: logLevels,
});