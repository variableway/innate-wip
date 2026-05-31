# Source: https://betterstack.com/community/guides/monitoring/kubernetes-health-checks/
# Original language: javascript
# Normalized: js
# Block index: 12

const express = require('express');
const app = express();
const db = require('./database');

let isInitialized = false;

async function initialize() {
  try {
    await db.connect();
    isInitialized = true;
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Initialization failed:', error);
    // We don't set isInitialized to true, so startup probe will continue to fail
  }
}

initialize();

// Startup probe endpoint
app.get('/api/startup', (req, res) => {
  if (isInitialized) {
    res.status(200).send('Application initialized');
  } else {
    res.status(503).send('Application initializing');
  }
});

// Liveness probe endpoint
app.get('/api/health', (req, res) => {
  // Simple check - just verify the process is running
  // For a more comprehensive check, you might verify that
  // critical application components are functioning
  res.status(200).send('OK');
});

// Readiness probe endpoint
app.get('/api/ready', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = await db.ping();

    if (dbStatus) {
      res.status(200).send('Ready');
    } else {
      res.status(503).send('Database not available');
    }
  } catch (err) {
    console.error('Readiness check failed:', err);
    res.status(503).send('Not ready');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});