# Source: https://betterstack.com/community/guides/scaling-nodejs/koajs-vs-expressjs/
# Original language: javascript
# Normalized: js
# Block index: 8

const request = require('supertest');

describe('User API', () => {
  it('should return user data', async () => {
    const response = await request(app)
      .get('/users/123')
      .expect(200);
    
    expect(response.body.id).toBe('123');
  });
});