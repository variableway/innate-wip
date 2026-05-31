# Source: https://betterstack.com/community/guides/scaling-nodejs/nextjs-vs-remix-vs-nuxt-3/
# Original language: jsx
# Normalized: js
# Block index: 11

// app/routes/users.jsx
import styles from '~/styles/users.css';

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Users() {
  return (
    <div className="users-container">
      <h1 className="users-heading">Users</h1>
      {/* ... */}
    </div>
  );
}