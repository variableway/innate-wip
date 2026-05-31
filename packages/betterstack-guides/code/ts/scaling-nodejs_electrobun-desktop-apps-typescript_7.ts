# Source: https://betterstack.com/community/guides/scaling-nodejs/electrobun-desktop-apps-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 7

[label src/bun/index.ts]
new BrowserWindow({
  title: "My App",
  url: "views://main/index.html",
[highlight]
  titleBarStyle: "hiddenInset",
[/highlight]
});