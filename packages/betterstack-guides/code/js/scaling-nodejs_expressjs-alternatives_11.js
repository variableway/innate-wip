# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: javascript
# Normalized: js
# Block index: 11

// usersPlugin.js
const usersPlugin = {
  name: 'users',
  version: '1.0.0',
  register: async function(server, options) {
    // Add routes related to users
    server.route([
      {
        method: 'GET',
        path: '/users',
        handler: (request, h) => {
          return [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
        }
      },
      {
        method: 'GET',
        path: '/users/{id}',
        handler: (request, h) => {
          return { id: request.params.id, name: `User ${request.params.id}` };
        }
      }
    ]);

    // Add a utility method for other plugins to use
    server.method('users.findById', (id) => {
      // In a real app, query a database
      return { id, name: `User ${id}` };
    });
  }
};

// In your main server file:
await server.register(usersPlugin);

// Now you can use the server method elsewhere
const user = await server.methods.users.findById(1);