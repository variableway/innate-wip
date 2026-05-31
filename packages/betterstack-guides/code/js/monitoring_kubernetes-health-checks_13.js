# Source: https://betterstack.com/community/guides/monitoring/kubernetes-health-checks/
# Original language: javascript
# Normalized: js
# Block index: 13

// Express.js example
app.get('/health', (req, res) => {
  // Simple check - just verify the process is running
  res.status(200).send('OK');
});

app.get('/ready', async (req, res) => {
  try {
    // Check database connection
    await db.ping();
    // Check cache connection
    await cache.ping();
    res.status(200).send('Ready');
  } catch (err) {
    res.status(503).send('Not Ready');
  }
});

app.get('/startup', async (req, res) => {
  try {
    // Check if initialization is complete
    if (appState.isInitialized()) {
      res.status(200).send('Started');
    } else {
      res.status(503).send('Initializing');
    }
  } catch (err) {
    res.status(503).send('Startup Error');
  }
});