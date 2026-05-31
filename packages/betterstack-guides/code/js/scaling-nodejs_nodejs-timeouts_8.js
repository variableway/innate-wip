# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-timeouts/
# Original language: javascript
# Normalized: js
# Block index: 8

(async function getDadJoke() {
  try {
    const response = await fetch('https://icanhazdadjoke.com', {
      headers: {
        Accept: 'application/json',
      },
      [highlight]
      signal: AbortSignal.timeout(3000), // 3 seconds
      [/highlight]
    });

    const json = await response.json();
    console.log(json);
  } catch (err) {
    console.error(err);
  }
})();