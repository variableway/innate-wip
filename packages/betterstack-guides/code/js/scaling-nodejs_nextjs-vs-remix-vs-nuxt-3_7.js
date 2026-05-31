# Source: https://betterstack.com/community/guides/scaling-nodejs/nextjs-vs-remix-vs-nuxt-3/
# Original language: jsx
# Normalized: js
# Block index: 7

// Server Component - app/users/page.js
export default async function UsersPage() {
  const users = await db.users.findMany();
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// Route Handler - app/api/users/route.js
export async function GET() {
  const users = await db.users.findMany();
  return Response.json(users);
}

export async function POST(request) {
  const data = await request.json();
  const user = await db.users.create({ data });
  return Response.json(user);
}

// Middleware - middleware.js
export default function middleware(request) {
  const token = request.cookies.get('token');
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/login', request.url));
  }
}