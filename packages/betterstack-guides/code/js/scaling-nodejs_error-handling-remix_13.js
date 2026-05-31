# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-remix/
# Original language: javascript
# Normalized: js
# Block index: 13

export async function loader() {
  if (badConditionIsTrue()) {
    throw new Response("Oh no! Something went wrong!", {
      status: 500,
    });
  }
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    // error.status = 500
    // error.data = "Oh no! Something went wrong!"
    return (
      <div className="error-container">
        <h1>{error.status} Error</h1>
        <p>{error.data}</p>
      </div>
    );
  }
  
  return (
    <div className="error-container">
      <h1>Unknown Error</h1>
      <p>Something unexpected happened. Please try again.</p>
    </div>
  );
}