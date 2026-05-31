# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-verbatimmodulesyntax/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label src/types.ts]
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
}

export const API_VERSION = "v1";

export function validateEmail(email: string): boolean {
  return email.includes("@");
}