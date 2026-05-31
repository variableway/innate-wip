# Source: https://betterstack.com/community/guides/monitoring/sre-golden-signals/
# Original language: javascript
# Normalized: js
# Block index: 3

import { Gauge } from 'prom-client';

const connectionPoolGauge = new Gauge({
  name: 'db_connection_pool_usage_ratio',
  help: 'Database connection pool usage ratio',
  labelNames: ['pool_name']
});

// Update the gauge regularly
function updateConnectionPoolMetrics() {
  const poolSize = db.pool.max;
  const activeConnections = db.pool.used;
  
  connectionPoolGauge.set(
    { pool_name: 'main' },
    activeConnections / poolSize
  );
}

setInterval(updateConnectionPoolMetrics, 5000);