# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nextjs/
# Original language: javascript
# Normalized: js
# Block index: 3

[label pages/500.js]
import Link from 'next/link';
import { useEffect } from 'react';

export default function Custom500() {
  useEffect(() => {
    // Report server error to analytics
    // This helps track which pages are generating server errors
    const reportError = async () => {
      await fetch('/api/error-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: '500_error',
          path: window.location.pathname,
          referrer: document.referrer
        })
      }).catch(console.error);
    };
    
    reportError();
  }, []);

  return (
    <div className="error-container">
      <h1>Server Error</h1>
      <p>We're sorry, something went wrong on our end.</p>
      <p>Our team has been notified and is working on a fix.</p>
      <div className="error-actions">
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
        <Link href="/">Return Home</Link>
      </div>
    </div>
  );
}