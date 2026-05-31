# Source: https://betterstack.com/community/guides/logging/log-levels-explained/
# Original language: javascript
# Normalized: js
# Block index: 8

logger.debug(
  {
    query: 'SELECT * FROM users WHERE age >= 18',
    time_taken_ms: 2.57,
  },
  'Select 18+ users from the database'
);