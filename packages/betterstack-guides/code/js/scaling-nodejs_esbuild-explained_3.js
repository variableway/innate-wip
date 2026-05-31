# Source: https://betterstack.com/community/guides/scaling-nodejs/esbuild-explained/
# Original language: javascript
# Normalized: js
# Block index: 3

[label src/main.js]
import { greet, getCurrentTime } from './utils';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  
  const heading = document.createElement('h1');
  heading.textContent = greet('esbuild user');
  
  const timeDisplay = document.createElement('p');
  timeDisplay.textContent = `Current time: ${getCurrentTime()}`;
  
  app.appendChild(heading);
  app.appendChild(timeDisplay);
  
  console.log('Application initialized!');
});