# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-debugging/
# Original language: javascript
# Normalized: js
# Block index: 6

[label index.js]
function getPrimes(max) {
  const sieve = {};
  const primes = [];

  for (let i = 2; i <= max; ++i) {
    [highlight]
    debugger;
    [/highlight]
    if (!sieve[i]) {
      primes.push(i);

      for (let j = i << 1; j <= max; j += i) {
        sieve[j] = true;
      }
    }
  }

  return primes;
}

console.log(getPrimes(100));