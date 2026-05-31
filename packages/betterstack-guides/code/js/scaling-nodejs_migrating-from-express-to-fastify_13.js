# Source: https://betterstack.com/community/guides/scaling-nodejs/migrating-from-express-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 13

// Express testing approach
import request from 'supertest';
import app from '../app.js';

describe('User API', () => {
  it('should get user by id', async () => {
    const user = await createTestUser();
    
    const response = await request(app)
      .get(`/api/users/${user.id}`)
      .expect(200);
      
    expect(response.body.id).toBe(user.id);
  });
});