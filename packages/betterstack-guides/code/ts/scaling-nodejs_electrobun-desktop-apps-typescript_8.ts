# Source: https://betterstack.com/community/guides/scaling-nodejs/electrobun-desktop-apps-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 8

[label src/bun/index.ts]
import { BrowserWindow, ApplicationMenu } from "electrobun/bun";

new BrowserWindow({
  title: "My App",
  url: "views://main/index.html",
});

ApplicationMenu.setApplicationMenu({
  mac: {
    app: [
      { label: "Quit", role: "quit" },
    ],
    edit: [
      { label: "Undo", role: "undo" },
      { label: "Redo", role: "redo" },
    ],
  },
});