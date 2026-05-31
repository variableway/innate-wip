# Source: https://betterstack.com/community/guides/scaling-nodejs/nextjs-vs-remix-vs-nuxt-3/
# Original language: jsx
# Normalized: js
# Block index: 16

[label app/users/error.js]
'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

// app/users/loading.js
export default function Loading() {
  return <div className="loading-spinner">Loading users...</div>;
}