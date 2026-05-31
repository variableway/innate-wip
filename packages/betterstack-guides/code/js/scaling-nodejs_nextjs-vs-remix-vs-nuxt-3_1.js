# Source: https://betterstack.com/community/guides/scaling-nodejs/nextjs-vs-remix-vs-nuxt-3/
# Original language: jsx
# Normalized: js
# Block index: 1

[label app/routes/users.jsx]
export default function Users() {
  return (
    <div>
      <h1>Users</h1>
      <nav>
        <Link to="new">New User</Link>
      </nav>
      
      {/* Child routes render here */}
      <Outlet />
    </div>
  );
}

// app/routes/users.$id.jsx - Child route
export default function UserProfile() {
  const { id } = useParams();
  const data = useLoaderData();
  
  return <div>User Profile: {id}</div>;
}

// Data loading tied directly to the route
export async function loader({ params }) {
  return fetchUser(params.id);
}