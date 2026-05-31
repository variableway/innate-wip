# Source: https://betterstack.com/community/guides/scaling-nodejs/electrobun-desktop-apps-typescript/
# Original language: typescript
# Normalized: ts
# Block index: 0

[label electrobun.config.ts]
export default {
  app: {
    name: "My App",
    identifier: "dev.my.app",
    version: "0.0.1",
  },
  build: {
    bun: {
      entrypoint: "src/bun/index.ts",
    },
  },
  views: {
    main: {
      entrypoint: "src/index.html",
    },
  },
};