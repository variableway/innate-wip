# Source: https://betterstack.com/community/guides/monitoring/kubernetes-health-checks/
# Original language: javascript
# Normalized: js
# Block index: 14

app.get('/ready', async (req, res) => {
  const checks = {
    database: false,
    cache: false,
    fileSystem: false
  };

  try {
    checks.database = await checkDatabase();
    checks.cache = await checkCache();
    checks.fileSystem = await checkFileSystem();

    const allHealthy = Object.values(checks).every(status => status === true);

    if (allHealthy) {
      res.status(200).json({ status: 'ready', checks });
    } else {
      console.error(`Readiness check failed: ${JSON.stringify(checks)}`);
      res.status(503).json({ status: 'not ready', checks });
    }
  } catch (err) {
    console.error(`Readiness check error: ${err.message}`);
    res.status(503).json({ status: 'error', message: err.message });
  }
});