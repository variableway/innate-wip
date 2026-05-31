# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 66

[label index.js]
import express from 'express';
import logger from './logger.js';
import axios from 'axios';
import pinoHTTP from 'pino-http';

const app = express();

[highlight]
app.use(
  pinoHTTP({
    logger,
  })
);
[/highlight]

app.get('/crypto', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api2.binance.com/api/v3/ticker/24hr'
    );

    const tickerPrice = response.data;

    res.json(tickerPrice);
  } catch (err) {
    logger.error(err);
    res.status(500).send('Internal server error');
  }
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});