# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-remix/
# Original language: javascript
# Normalized: js
# Block index: 11

// app/routes/dashboard.projects.$projectId.tsx
export default function Project() {
  const { project } = useLoaderData();
  
  useEffect(() => {
    // Error in a client-side effect
    if (project.status === "broken") {
      throw new Error("Project is in a broken state");
    }
  }, [project]);
  
  return <div>Project details...</div>;
}

export function ErrorBoundary() {
  const error = useRouteError();
  
  return (
    <div className="isolated-error">
      <h3>Project Error</h3>
      <p>{error instanceof Error ? error.message : "Unknown error"}</p>
      <Link to="..">View all projects</Link>
    </div>
  );
}