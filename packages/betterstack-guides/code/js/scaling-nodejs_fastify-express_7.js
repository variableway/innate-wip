# Source: https://betterstack.com/community/guides/scaling-nodejs/fastify-express/
# Original language: javascript
# Normalized: js
# Block index: 7

[label userPlugin.js]
export function userPlugin(app) {
  const userService = {
    getUser: (id) => ({ id, name: `User ${id}` }),
  };

  app.get('/user/:id', (req, res) => {
    const user = userService.getUser(req.params.id);
    res.json(user);
  });
}