# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-remix/
# Original language: javascript
# Normalized: js
# Block index: 3

export function ErrorBoundary() {
  const error = useRouteError();
  let message = "We've encountered a problem, please try again. Sorry!";
  
  // Handle standard JavaScript errors
  if (error instanceof Error) {
    message = error.message;
  }
  
  // Handle Response errors thrown from loaders/actions
  if (isRouteErrorResponse(error)) {
    message = error.data;
  }
  
  return (
    <div className="error-container">
      <h1>Something went wrong</h1>
      <p>{message}</p>
    </div>
  );
}