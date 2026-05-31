# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 18

// Framework-agnostic business logic
const userService = {
  async getUsers() {
    // Database operations
    return [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
  },

  async getUserById(id) {
    // Database operations
    return { id, name: `User ${id}` };
  }
};

// Express implementation
app.get('/users', async (req, res) => {
  const users = await userService.getUsers();
  res.json(users);
});

// Can be easily adapted to Fastify, Koa, etc.