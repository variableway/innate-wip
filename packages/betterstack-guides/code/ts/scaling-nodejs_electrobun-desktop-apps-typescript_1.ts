# Source: https://betterstack.com/community/guides/scaling-nodejs/electrobun-desktop-apps-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 1

[label src/bun/index.ts]
import { BrowserWindow } from "electrobun/bun";

new BrowserWindow({
  title: "Hello Electrobun",
  url: "views://main/index.html",
});