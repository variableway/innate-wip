# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-remix/
# Original language: javascript
# Normalized: js
# Block index: 0

export function ErrorBoundary({ error }) {
  console.error(error);
  return (
    <div className="error-container">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}