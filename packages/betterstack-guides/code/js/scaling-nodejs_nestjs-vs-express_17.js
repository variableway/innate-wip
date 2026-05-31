# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-express/
# Original language: javascript
# Normalized: js
# Block index: 17

// tests/users.test.js
const request = require('supertest');
const app = require('../app');

describe('Users API', () => {
  it('should create user with valid data', async () => {
    const userData = { name: 'Jane', email: 'jane@example.com' };

    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);

    expect(response.body.name).toBe(userData.name);
  });
});