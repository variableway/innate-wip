# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 19

interface ApiRequest<T = any> {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: T;
}

// No need to specify the type parameter
const getRequest: ApiRequest = {
  endpoint: '/users',
  method: 'GET'
};

// Specify a type for the data
const postRequest: ApiRequest<{ name: string; email: string }> = {
  endpoint: '/users',
  method: 'POST',
  data: {
    name: 'Alice',
    email: 'alice@example.com'
  }
};