# Source: https://betterstack.com/community/guides/scaling-nodejs/typescript-generics/
# Original language: typescript
# Normalized: ts
# Block index: 11

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
}

// User data type
interface User {
  id: number;
  name: string;
  email: string;
}

// A response containing user data
const userResponse: ApiResponse<User> = {
  data: {
    id: 1,
    name: "Jane Doe",
    email: "jane@example.com"
  },
  status: 200,
  message: "Success",
  timestamp: new Date()
};