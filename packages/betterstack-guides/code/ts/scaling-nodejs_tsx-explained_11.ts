# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-explained/
# Original language: typescript
# Normalized: ts
# Block index: 11

[label src/app.ts]
import { formatMessage, formatObject } from '@utils/formatter';

interface UserData {
  id: number;
  name: string;
  email: string;
}

const userData: UserData = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};

console.log(formatMessage('Processing user data'));
console.log(formatObject(userData));