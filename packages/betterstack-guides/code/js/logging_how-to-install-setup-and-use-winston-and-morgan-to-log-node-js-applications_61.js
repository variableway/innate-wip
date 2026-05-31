# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 61

[label server.js]
...
import axios from 'axios';
[highlight]
import { Logtail } from '@logtail/node';
import { LogtailTransport } from '@logtail/winston';

// Create a Logtail client
const logtail = new Logtail('<your_source_token>', {
  endpoint: 'https://<your_ingesting_host>',
});
[/highlight]
const { combine, timestamp, json } = winston.format;
const app = express();

const logger = winston.createLogger({
  level: 'http',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    json()
  ),
  transports: [
    new winston.transports.Console(), 
[highlight]
    new LogtailTransport(logtail)
[/highlight]
  ],
});

// Rest of your server code...

. . .