# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-remix/
# Original language: javascript
# Normalized: js
# Block index: 9

[label app/routes/dashboard.projects.$projectId.tsx]
export default function Project() {
  const { project } = useLoaderData();
  
  return (
    <div className="project-detail">
      <h2>{project.name}</h2>
      <p>Status: {project.status}</p>
      <p>Deadline: {project.deadline}</p>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  
  return (
    <div className="project-error-container">
      <h2>Project Error</h2>
      <p>There was a problem loading this project.</p>
      <Link to="../">Return to projects list</Link>
    </div>
  );
}