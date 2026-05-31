# Source: https://betterstack.com/community/guides/scaling-nodejs/nextjs-vs-remix-vs-nuxt-3/
# Original language: jsx
# Normalized: js
# Block index: 5

// app/routes/users.jsx
import { useLoaderData, useFetcher } from '@remix-run/react';

export async function loader() {
  const users = await fetchUsers();
  return users;
}

export async function action({ request }) {
  const formData = await request.formData();
  return createUser({
    name: formData.get('name'),
    email: formData.get('email')
  });
}

export default function Users() {
  const users = useLoaderData();
  const fetcher = useFetcher();
  
  return (
    <div>
      <h1>Users</h1>
      
      <fetcher.Form method="post">
        <input name="name" placeholder="Name" />
        <input name="email" placeholder="Email" />
        <button type="submit">Add User</button>
      </fetcher.Form>
      
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}