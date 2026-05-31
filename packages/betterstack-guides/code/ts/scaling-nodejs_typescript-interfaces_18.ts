# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-interfaces/
# Original language: typescript
# Normalized: ts
# Block index: 18

interface EventHandler<T> {
  (event: T): void;
}

interface ClickEvent {
  x: number;
  y: number;
}

const handleClick: EventHandler<ClickEvent> = (event) => {
  console.log(`Clicked at ${event.x}, ${event.y}`);
};