# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-verbatimmodulesyntax/
# Original language: typescript
# Normalized: ts
# Block index: 9

[label src/service.ts]
[highlight]
import type { User, Product } from "./types.js";
import { API_VERSION, validateEmail } from "./types.js";
[/highlight]

export class UserService {
  getUser(id: number): User {
    return {
      id,
      name: "John Doe",
      email: "john@example.com"
    };
  }

  validateUserEmail(user: User): boolean {
    return validateEmail(user.email);
  }
}

export class ProductService {
  getProduct(id: number): Product {
    return {
      id,
      title: "Sample Product",
      price: 99.99
    };
  }

  getApiVersion(): string {
    return API_VERSION;
  }
}