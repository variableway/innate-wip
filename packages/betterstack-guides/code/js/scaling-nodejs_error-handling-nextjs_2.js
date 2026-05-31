# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nextjs/
# Original language: javascript
# Normalized: js
# Block index: 2

[label pages/404.js]
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="error-container">
      <h1>Page Not Found</h1>
      <p>We couldn't find what you were looking for.</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}