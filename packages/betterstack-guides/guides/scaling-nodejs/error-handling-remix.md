# Remix Error Handling Patterns

Effective error handling is crucial to building reliable, user-friendly, and easy-to-maintain Remix applications. Without thoughtful error-handling strategies, your app risks unexpected crashes, confusing users, or inadvertently exposing sensitive data.

In this guide, you'll explore practical error-handling patterns that you can use for your Remix applications. 

[ad-logs]

## Understanding errors in Remix

Remix sets a new precedent in web application error handling that you'll appreciate. The framework automatically catches most errors in your code—whether on the server or in the browser—and renders the closest ErrorBoundary to where the error occurred.

Errors in Remix applications typically fall into three major categories, each requiring different handling approaches:

### Operational errors (expected failures)

These errors occur during normal application operation and should be anticipated and handled gracefully. Rather than representing bugs, they result from external conditions that need proper management.

Examples include:

- A user requests a non-existent resource (resulting in a `404 Not Found`).
- Invalid form submissions that fail validation (`400 Bad Request`).
- Database queries that time out due to connectivity issues (`500 Internal Server Error`).
- External API dependencies that fail to respond within expected timeframes.

### Programmer errors (bugs)

These errors stem from mistakes in the codebase and typically require fixes rather than runtime handling mechanisms.

For instance, accessing undefined properties can lead to `TypeError` exceptions, using incorrect route parameters may cause unexpected behavior, and improperly handling asynchronous operations often results in unresolved promises affecting application flow.

### System Errors

These errors originate at the infrastructure level, potentially impacting the entire application's stability. 

Examples include server memory exhaustion preventing proper request handling, filesystem permission issues blocking access to static assets, and network partitions disrupting communication between application services.

Now that we understand the different error types in Remix applications, let's explore how to handle them effectively.

## Remix's built-in error handling system

Remix provides a sophisticated error boundary system that distinguishes it from other React frameworks. This system allows for elegant error handling at different levels of your application.

### ErrorBoundary components

Remix leverages React's error boundary concept but enhances it with route-specific error handling. Each route module can export an `ErrorBoundary` component that catches errors occurring within that route:

```javascript
export function ErrorBoundary({ error }) {
  console.error(error);
  return (
    <div className="error-container">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}
```

When an error occurs within a route component or its loaders/actions, Remix automatically renders this component instead of the route component. This provides a clean way to isolate errors and prevent them from cascading through your application.

### Hierarchical error boundaries

One of Remix's most powerful features is its hierarchical error handling. If a route doesn't have an `ErrorBoundary`, Remix will look for the nearest ancestor route with one, creating a fallback system:

```javascript
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
```

This mechanism allows for specialized error handling at specific routes while ensuring that all errors are caught somewhere in the application hierarchy.

## Handling data loading errors

Remix separates UI rendering from data loading through its loader functions, which introduces unique error handling requirements.

### Throwing errors in loaders

In Remix, you can throw errors directly from loader functions, and they will be automatically caught by the route's `ErrorBoundary`:

```javascript
export async function loader({ params }) {
  const product = await db.product.findUnique({
    where: { id: params.productId },
  });
  
  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }
  
  return json({ product });
}
```

This approach is cleaner than manual error handling in each loader and keeps error handling code centralized in your `ErrorBoundary` components.

Remix will automatically catch errors thrown while:

- Rendering in the browser
- Rendering on the server
- In a loader during the initial server-rendered document request
- In an action during the initial server-rendered document request
- In a loader during a client-side transition in the browser (Remix serializes the error and sends it over the network)
- In an action during a client-side transition in the browser

### Identifying error types with `useRouteError`

Remix provides the `useRouteError` hook to access the error that triggered the error boundary, along with the `isRouteErrorResponse` utility to differentiate between error types:

```javascript
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
```

By throwing `Response` objects instead of errors, you signal to Remix that this is an expected condition rather than a bug:

```javascript
export async function loader({ request }) {
  const user = await getUser(request);
  
  if (!user) {
    throw new Response("Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
    });
  }
  
  return json({ user });
}
```

This separation of concerns makes your application more maintainable by distinguishing between exceptional conditions and expected errors.

## Creating custom error classes

As your Remix application grows in complexity, generic error objects may become insufficient. Custom error classes enable better error categorization and contextual handling.


A base error class can standardize error formatting across your application:

```javascript
export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}
```

This base class allows you to create more specialized error types for different scenarios:

```javascript
export class ValidationError extends AppError {
  constructor(message, fields) {
    super(message, 400);
    this.fields = fields;
  }
}

export class AuthenticationError extends AppError {
  constructor(message) {
    super(message, 401);
  }
}
```

With custom error classes defined, you can use them in your loaders and actions:

```javascript
export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  
  const errors = {};
  if (!email || !email.includes("@")) {
    errors.email = "Please provide a valid email";
  }
  
  if (Object.keys(errors).length > 0) {
    throw new ValidationError("Invalid form submission", errors);
  }
  
  // Continue with valid form data
  return json({ success: true });
}
```


Your error boundaries can be adapted to handle these custom errors with contextual responses:

```javascript
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
```

This approach provides users with more meaningful error messages based on the specific error type.


## Nested error boundaries

Remix implements a hierarchical error handling system that prevents errors in one component from breaking your entire application. When an error occurs, Remix locates the closest error boundary to handle it while preserving the rest of the UI. If a route lacks an error boundary, the error "bubbles up" through the hierarchy until it finds one.

Consider a typical route structure with nested components: a dashboard parent route containing projects, and individual project detail routes. If an error occurs in a project detail page, Remix first checks if that route has an ErrorBoundary. When present, Remix renders that boundary while maintaining all parent routes intact. Remix searches progressively upward through parent routes without a local boundary until finding one.

Routes can implement context-specific error handling through their own error boundaries. For example, a project detail route might define an error boundary that provides navigation back to the projects list:

```javascript
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
```

The true power of this system becomes evident in how it preserves parent UI components. A dashboard layout typically contains navigation elements and an outlet for child routes:

```javascript
[label app/routes/dashboard.tsx]
export default function Dashboard() {
  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <Link to="/dashboard">Overview</Link>
        <Link to="/dashboard/projects">Projects</Link>
        <Link to="/dashboard/settings">Settings</Link>
      </nav>
      <main className="dashboard-content">
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
}
```

When an error triggers in a child route with its own error boundary, the dashboard navigation remains completely functional. Only the content within the Outlet is replaced with the error UI. This containment applies to both server-side errors in loaders and actions as well as client-side errors in components:

```javascript
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
```

Only the project detail section displays an error when such an error occurs while the dashboard layout, navigation, and other elements continue functioning normally. Users can navigate away from problematic sections without losing context or requiring a page refresh.

This approach proves especially valuable for complex applications where users should be able to continue using unaffected features even when one part encounters an error. 

## Error sanitization in production

In production mode, Remix automatically sanitizes errors that occur on the server to prevent leaking sensitive information (such as stack traces) to the client. This means that the `Error` instance you receive from `useRouteError` will have a generic message and no stack trace:

```javascript
export async function loader() {
  if (badConditionIsTrue()) {
    throw new Error("Oh no! Something went wrong!");
  }
}

export function ErrorBoundary() {
  const error = useRouteError();
  // When NODE_ENV=production:
  // error.message = "Unexpected Server Error"
  // error.stack = undefined
  
  return (
    <div className="error-container">
      <h1>Application Error</h1>
      <p>Something went wrong. Please try again later.</p>
    </div>
  );
}
```

If you need to log these errors or report them to a third-party service such as BugSnag or Sentry, you can do this through a `handleError` export in your `app/entry.server.js` file. This method receives the un-sanitized versions of the error since it runs on the server.

For errors that should be displayed to users with specific messages, throw a `Response` object instead:

```javascript
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
```

## Server-side vs. client-side error handling

Remix runs code on the server and client, requiring thoughtful error-handling strategies for each environment.

### Server-side error handling

Server-side errors in Remix occur in loaders, actions, and server-rendered components. These errors should be handled with security in mind to prevent information leakage:

```javascript
export async function loader({ request }) {
  try {
    const data = await fetchSensitiveData();
    return json(data);
  } catch (error) {
    console.error("Database error:", error);
    
    // Don't expose internal error details to the client
    throw new Response("Internal Server Error", { status: 500 });
  }
}
```

Detailed error information should be logged server-side for production environments, but simplified error messages should be sent to clients.

### Client-side error handling

Client-side errors occur during user interactions and component rendering in the browser. These require different handling:

```javascript
function ClickCounter() {
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    try {
      // Some operation that might fail
      if (someRiskyCondition) {
        throw new Error("Something went wrong in the effect");
      }
    } catch (e) {
      setError(e);
    }
    
    const handleError = (event) => {
      // Log client-side errors
      console.error("Client error:", event.error);
    };
    
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);
  
  // Re-throw the error if it happened
  if (error) {
    throw error; // This will be caught by the nearest ErrorBoundary
  }
  
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
}
```

For client-side operations, it's often best to catch errors, update the state, and re-throw them to let Remix's error boundaries handle the UI. This pattern works exceptionally well when the error happens in an effect or event handler.


## Final thoughts
This article explored Remix's built-in error boundaries, custom error classes, and practical strategies for enhancing application stability and maintainability. 


Following these best practices helps you build resilient applications that gracefully handle failures and deliver a better user experience.

Thanks for reading, and happy coding!