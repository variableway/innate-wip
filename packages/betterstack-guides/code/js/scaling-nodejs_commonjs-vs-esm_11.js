# Source: https://betterstack.com/community/guides/scaling-nodejs/commonjs-vs-esm/
# Original language: javascript
# Normalized: js
# Block index: 11

async function loadModule() {
  const { addTwo } = await import('./addTwo.mjs'); // dynamic import
  console.log(addTwo(3));
}
loadModule();