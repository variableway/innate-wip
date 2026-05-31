# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-remix/
# Original language: javascript
# Normalized: js
# Block index: 10

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