# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nextjs/
# Original language: javascript
# Normalized: js
# Block index: 6

[label app/global-error.js]
'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Report critical error
    captureException(error, { level: 'fatal' });
  }, [error]);

  return (
    <html>
      <head>
        <title>Critical Error</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="global-error-container">
          <h1>We're Sorry</h1>
          <p>We've encountered a critical error.</p>
          <div className="error-actions">
            <button onClick={() => reset()}>Try Again</button>
            <button onClick={() => window.location.href = '/'}>
              Return Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}