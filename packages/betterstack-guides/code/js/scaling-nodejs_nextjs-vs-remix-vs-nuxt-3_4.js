# Source: https://betterstack.com/community/guides/scaling-nodejs/nextjs-vs-remix-vs-nuxt-3/
# Original language: jsx
# Normalized: js
# Block index: 4

// Pages Router - pages/users.js
import useSWR from 'swr';

export default function UsersPage({ initialData }) {
  const { data: users } = useSWR('/api/users', fetcher, { 
    fallbackData: initialData 
  });
  
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  const users = await fetchUsers();
  return { props: { initialData: users }, revalidate: 60 };
}