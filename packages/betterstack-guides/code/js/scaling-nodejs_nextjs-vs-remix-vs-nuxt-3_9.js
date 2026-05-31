# Source: https://betterstack.com/community/guides/scaling-nodejs/nextjs-vs-remix-vs-nuxt-3/
# Original language: js
# Normalized: js
# Block index: 9

// server/api/users.js
export default defineEventHandler(async (event) => {
  // Get all users
  return await db.users.findMany();
});

// server/api/users/[id].js
export default defineEventHandler(async (event) => {
  const id = event.context.params.id;
  
  // Handle different HTTP methods
  if (event.node.req.method === 'GET') {
    return await db.users.findUnique({ where: { id } });
  }
  
  if (event.node.req.method === 'DELETE') {
    return await db.users.delete({ where: { id } });
  }
  
  if (event.node.req.method === 'PUT') {
    const body = await readBody(event);
    return await db.users.update({
      where: { id },
      data: body
    });
  }
});

// server/middleware/auth.js
export default defineEventHandler((event) => {
  const token = getCookie(event, 'token');
  if (!token && event.path.startsWith('/dashboard')) {
    return sendRedirect(event, '/login');
  }
});