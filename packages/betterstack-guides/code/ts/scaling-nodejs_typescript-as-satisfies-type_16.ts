# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 16

[label complex-guards.ts]
function isHTMLInputElement(element: Element): element is HTMLInputElement {
  return element.tagName === "INPUT";
}

const element = document.querySelector(".form-field");

if (element && isHTMLInputElement(element)) {
  element.value = "test"; // TypeScript knows it's an input
} else if (element) {
  // Need assertion for specific element type
  const textarea = element as HTMLTextAreaElement;
  textarea.value = "test";
}