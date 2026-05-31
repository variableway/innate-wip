# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-timeouts/
# Original language: javascript
# Normalized: js
# Block index: 15

[label promise-with-timeout.js]
import timersPromises from 'node:timers/promises';

function slowOperation() {
  // resolve in 10 seconds
  return timersPromises.setTimeout(10000);
}

[highlight]
function promiseWithTimeout(promiseArg, timeoutMS) {
  let timer;
  const timeoutPromise = new Promise(
    (resolve, reject) =>
      (timer = setTimeout(
        () => reject(`Timed out after ${timeoutMS} ms.`),
        timeoutMS
      ))
  ).finally(() => clearTimeout(timer));

  return Promise.race([promiseArg, timeoutPromise]);
}
[/highlight]

(async function doSomethingAsync() {
  try {
    [highlight]
    await promiseWithTimeout(slowOperation(), 2000);
    [/highlight]
    console.log('Completed slow operation in 10 seconds');
  } catch (err) {
    console.error('Failed to complete slow operation due to error:', err);
  }
})();