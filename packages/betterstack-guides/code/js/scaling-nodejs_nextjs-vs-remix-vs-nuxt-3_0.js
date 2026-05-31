# Source: https://betterstack.com/community/guides/scaling-nodejs/nextjs-vs-remix-vs-nuxt-3/
# Original language: jsx
# Normalized: js
# Block index: 0

// Pages Router - pages/users/[id].js
import { useRouter } from 'next/router';

export default function UserProfile() {
  const router = useRouter();
  const { id } = router.query;
  
  return <div>User Profile: {id}</div>;
}

// App Router - app/users/[id]/page.js
export default function UserProfile({ params }) {
  return <div>User Profile: {params.id}</div>;
}