# Source: https://betterstack.com/community/guides/scaling-nodejs/migrating-from-express-to-fastify/
# Original language: javascript
# Normalized: js
# Block index: 14

// Fastify testing approach
import { build } from '../app.js';

describe('User API', () => {
  let app;
  
  beforeEach(async () => {
    app = build({ logger: false });
    await app.ready();
  });
  
  afterEach(() => app.close());
  
  it('should get user by id', async () => {
    const user = await createTestUser();
    
    const response = await app.inject({
      method: 'GET',
      url: `/api/users/${user.id}`
    });
    
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.id).toBe(user.id);
  });
});