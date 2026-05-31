# Source: https://betterstack.com/community/guides/scaling-nodejs/ts-verbatimmodulesyntax/
# Original language: javascript
# Normalized: js
# Block index: 10

[output];
import { API_VERSION, validateEmail } from "./types.js";
export class UserService {
  getUser(id) {
    return {
      id,
      name: "John Doe",
      email: "john@example.com",
    };
  }
  validateUserEmail(user) {
    return validateEmail(user.email);
  }
}
export class ProductService {
  getProduct(id) {
    return {
      id,
      title: "Sample Product",
      price: 99.99,
    };
  }
  getApiVersion() {
    return API_VERSION;
  }
}