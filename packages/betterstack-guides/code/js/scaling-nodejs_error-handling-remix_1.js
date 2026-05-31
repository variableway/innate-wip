# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-remix/
# Original language: javascript
# Normalized: js
# Block index: 1

// app/root.jsx - handles application-wide errors
export function ErrorBoundary({ error }) {
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Application Error</h1>
        <p>The application encountered an unexpected error.</p>
        <Scripts />
      </body>
    </html>
  );
}