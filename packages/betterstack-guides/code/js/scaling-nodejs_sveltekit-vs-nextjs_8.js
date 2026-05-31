# Source: https://betterstack.com/community/guides/scaling-nodejs/sveltekit-vs-nextjs/
# Original language: jsx
# Normalized: js
# Block index: 8

// Complex routing features
export default function Layout({ children, params }) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
}

// Parallel routes, intercepting routes, etc.