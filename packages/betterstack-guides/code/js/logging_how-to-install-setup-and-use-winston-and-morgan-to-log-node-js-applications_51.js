# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 51

[label index.js]
import './loggers.js';
import winston from 'winston';

const serviceALogger = winston.loggers.get('serviceALogger');
const serviceBLogger = winston.loggers.get('serviceBLogger');

serviceALogger.error('logging to a file');
serviceBLogger.warn('logging to the console');