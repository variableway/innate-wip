# Source: https://betterstack.com/community/guides/scaling-nodejs/nextjs-vs-remix-vs-nuxt-3/
# Original language: jsx
# Normalized: js
# Block index: 17

[label app/routes/users.jsx]
import { Outlet, useCatch, useLoaderData } from '@remix-run/react';

export async function loader() {
  const users = await fetchUsers();
  if (!users) throw new Response('Not Found', { status: 404 });
  return users;
}

export default function Users() {
  const users = useLoaderData();
  
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <Outlet />
    </div>
  );
}

// Handle errors thrown in the loader or action
export function CatchBoundary() {
  const caught = useCatch();
  
  if (caught.status === 404) {
    return <div>No users found</div>;
  }
  
  return (
    <div>
      <h1>Error {caught.status}</h1>
      <p>{caught.data}</p>
    </div>
  );
}

// Handle unexpected errors
export function ErrorBoundary({ error }) {
  return (
    <div>
      <h1>Error!</h1>
      <p>{error.message}</p>
    </div>
  );
}