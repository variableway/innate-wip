# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-runtime/
# Original language: javascript
# Normalized: js
# Block index: 12

[label async-example.js]
import jiti from './loader.js';

// Synchronous JSON loading - Jiti parses JSON and returns the object
const config = jiti('./config.json');
console.log('Config loaded:', config.appName);

// Async import with error handling - useful for conditional loading
async function loadModuleAsync() {
  try {
    const module = await jiti.import('./example.ts');
    console.log('Async loaded:', module);
  } catch (error) {
    console.error('Failed to load module:', error);
  }
}

loadModuleAsync();