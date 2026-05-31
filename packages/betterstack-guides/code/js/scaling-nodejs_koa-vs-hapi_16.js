# Source: https://betterstack.com/community/guides/scaling-nodejs/koa-vs-hapi/
# Original language: javascript
# Normalized: js
# Block index: 16

const request = require('supertest');

describe('User API', () => {
  test('should return user data', async () => {
    const response = await request(app.callback())
      .get('/users/1')
      .set('Authorization', 'Bearer token')
      .expect(200);
    
    expect(response.body.id).toBe(1);
  });
});