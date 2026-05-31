# Source: https://betterstack.com/community/guides/scaling-nodejs/sveltekit-vs-nextjs/
# Original language: javascript
# Normalized: js
# Block index: 13

// src/routes/api/users/+server.js
export async function GET() {
  const users = await db.user.findMany();
  return new Response(JSON.stringify(users));
}

export async function POST({ request }) {
  const body = await request.json();
  const user = await db.user.create({ data: body });
  return new Response(JSON.stringify(user), { status: 201 });
}