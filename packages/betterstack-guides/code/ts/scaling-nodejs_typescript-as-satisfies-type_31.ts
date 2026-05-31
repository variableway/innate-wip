# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-as-satisfies-type/
# Original language: typescript
# Normalized: ts
# Block index: 31

[label discriminator-satisfies.ts]
const event = {
  type: "click",
  x: 100,
  y: 200
} satisfies UIEvent;

event.type; // Type: "click"