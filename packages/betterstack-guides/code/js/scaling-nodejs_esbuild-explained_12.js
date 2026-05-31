# Source: https://betterstack.com/community/guides/scaling-nodejs/esbuild-explained/
# Original language: javascript
# Normalized: js
# Block index: 12

[label src/ui.js]
// Simple helper functions for UI elements
export function createButton(text, clickHandler) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', clickHandler);
  return button;
}

export function addStyles(element, styles) {
  Object.assign(element.style, styles);
  return element;
}