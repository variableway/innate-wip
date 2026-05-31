# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-remix/
# Original language: javascript
# Normalized: js
# Block index: 8

export function ErrorBoundary({ error }) {
  if (error instanceof ValidationError) {
    return (
      <div className="validation-error">
        <h2>Validation Error</h2>
        <p>{error.message}</p>
        <ul>
          {Object.entries(error.fields).map(([field, message]) => (
            <li key={field}>
              <strong>{field}:</strong> {message}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  return (
    <div className="error-container">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}