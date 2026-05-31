# Source: https://betterstack.com/community/guides/scaling-nodejs/understanding-abortcontroller/
# Original language: javascript
# Normalized: js
# Block index: 11

async function fetchWithTimeout(url, options = {}) {
  const { timeoutMS = 3000 } = options;

  return await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(timeoutMS),
  });
}