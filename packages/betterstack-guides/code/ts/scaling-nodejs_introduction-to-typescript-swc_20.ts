# Source: https://betterstack.com/community/guides/scaling-nodejs/introduction-to-typescript-swc/
# Original language: typescript
# Normalized: ts
# Block index: 20

[label src/__tests__/UserService.test.ts]
import { describe, it, expect, beforeEach } from 'vitest';

// We need to create a separate UserService for testing
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

class UserService {
  private users: User[] = [];

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      id: Math.floor(Math.random() * 10000),
      createdAt: new Date(),
      ...userData
    };
    
    this.users.push(newUser);
    return newUser;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }
}

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it('should create a new user with generated id and timestamp', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    };

    const createdUser = await userService.createUser(userData);

    expect(createdUser).toHaveProperty('id');
    expect(createdUser).toHaveProperty('createdAt');
    expect(createdUser.name).toBe(userData.name);
    expect(createdUser.email).toBe(userData.email);
    expect(typeof createdUser.id).toBe('number');
    expect(createdUser.createdAt).toBeInstanceOf(Date);
  });
});