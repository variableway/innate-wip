# Source: https://betterstack.com/community/guides/scaling-nodejs/koa-vs-hapi/
# Original language: javascript
# Normalized: js
# Block index: 17

const server = Hapi.server();
await server.initialize();

describe('User API', () => {
  test('should return user data', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/users/1',
      headers: { authorization: 'Bearer token' }
    });
    
    expect(response.statusCode).toBe(200);
    expect(response.result.id).toBe(1);
  });
});