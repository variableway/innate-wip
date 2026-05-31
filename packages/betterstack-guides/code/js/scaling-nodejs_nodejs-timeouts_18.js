# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-timeouts/
# Original language: javascript
# Normalized: js
# Block index: 18

function slowOperation(abortSignal) {
  // resolve in 10 seconds
  [highlight]
  return timersPromises.setTimeout(10000, null, { signal: abortSignal });
  [/highlight]
}

. . .

(async function doSomethingAsync() {
  [highlight]
  const ac = new AbortController();
  [/highlight]
  try {
  [highlight]
    await promiseWithTimeout(slowOperation(ac.signal), 2000);
  [/highlight]
    console.log('Completed slow operation in 10 seconds');
  } catch (err) {
    console.error('Failed to complete slow operation due to error:', err);
  } finally {
  [highlight]
    ac.abort();
  [/highlight]
  }
})();