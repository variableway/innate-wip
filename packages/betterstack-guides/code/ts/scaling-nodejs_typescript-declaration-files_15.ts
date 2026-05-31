# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-declaration-files/
# Original language: typescript
# Normalized: ts
# Block index: 15

[label src/external-lib.d.ts]
declare module "untyped-library" {
  export function doSomething(param: string): Promise<number>;
  export class Helper {
    constructor(config: { timeout: number });
    execute(): void;
  }
}