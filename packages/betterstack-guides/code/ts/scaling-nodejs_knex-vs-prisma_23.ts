# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 23

// Setting up Prisma for testing
// jest.setup.js
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn()
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = mockDeep<PrismaClient>();
(PrismaClient as jest.Mock).mockImplementation(() => prismaMock);

// In your test file
import { prismaMock } from '../jest.setup';
import { UserService } from './user-service';

test('creates a user', async () => {
  const user = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com'
  };
  
  prismaMock.user.create.mockResolvedValue(user);
  
  const userService = new UserService(prismaMock);
  const result = await userService.createUser({ name: 'Test User', email: 'test@example.com' });
  
  expect(result).toEqual(user);
});