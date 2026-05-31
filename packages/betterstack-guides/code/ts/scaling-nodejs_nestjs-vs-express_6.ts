# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-express/
# Original language: typescript
# Normalized: ts
# Block index: 6

import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [{ id: 1, name: 'John', email: 'john@example.com' }];

  findAll() {
    return this.users;
  }

  create(name: string, email: string) {
    const newUser = { id: Date.now(), name, email };
    this.users.push(newUser);
    return newUser;
  }
}