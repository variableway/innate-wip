# Source: https://betterstack.com/community/guides/scaling-nodejs/knex-vs-prisma/
# Original language: typescript
# Normalized: ts
# Block index: 24

// Integration testing with a real database
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

const generateDatabaseURL = (schema: string) => {
  // Generate a unique schema name for test isolation
  return `postgresql://user:password@localhost:5432/testdb?schema=${schema}`;
};

jest.setTimeout(60000);

describe('User integration tests', () => {
  let prisma: PrismaClient;
  let schema: string;
  
  beforeAll(async () => {
    schema = `test_${uuid()}`;
    process.env.DATABASE_URL = generateDatabaseURL(schema);
    
    // Create the test schema and run migrations
    execSync(`npx prisma migrate deploy`, {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    });
    
    prisma = new PrismaClient();
  });
  
  afterAll(async () => {
    await prisma.$executeRaw`DROP SCHEMA IF EXISTS "${schema}" CASCADE`;
    await prisma.$disconnect();
  });
  
  test('creates and retrieves a user', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'Integration Test User',
        email: 'integration@example.com'
      }
    });
    
    const retrieved = await prisma.user.findUnique({
      where: { id: user.id }
    });
    
    expect(retrieved).toMatchObject({
      name: 'Integration Test User',
      email: 'integration@example.com'
    });
  });
});