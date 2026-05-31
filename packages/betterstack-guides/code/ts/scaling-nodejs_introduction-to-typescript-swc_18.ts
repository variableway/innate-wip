# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-typescript-swc/
# Original language: typescript
# Normalized: ts
# Block index: 18

[label vitest.config.ts]
import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [
    swc.vite({
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        target: 'es2022',
        keepClassNames: true,
      },
      module: {
        type: 'es6',
      },
      sourceMaps: true,
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
  },
});