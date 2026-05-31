# Source: https://betterstack.com/community/guides/scaling-nodejs/esbuild-explained/
# Original language: javascript
# Normalized: js
# Block index: 8

[label src/utils.js]
export function greet(name) {
[highlight]// Make the greet function more sophisticated
  const hour = new Date().getHours();
  let greeting = '';
  
  if (hour < 12) {
    greeting = 'Good morning';
  } else if (hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }
  
  return `${greeting}, ${name}! Welcome to esbuild.`;[/highlight]
}
export function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString();
}