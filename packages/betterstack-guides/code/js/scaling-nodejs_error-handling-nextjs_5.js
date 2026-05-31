# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nextjs/
# Original language: javascript
# Normalized: js
# Block index: 5

[label app/dashboard/error.js]
'use client';

import { useEffect } from 'react';

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    // Report error to analytics
    reportError('dashboard_error', {
      message: error.message,
      stack: error.stack
    });
  }, [error]);
  
  return (
    <div className="error-container">
      <h2>Dashboard Error</h2>
      <p>{error.message || 'An unexpected error occurred'}</p>
      
      <div className="error-actions">
        <button onClick={() => reset()}>
          Try Again
        </button>
        <a href="/support">Contact Support</a>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <pre>{error.stack}</pre>
      )}
    </div>
  );
}