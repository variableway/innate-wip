# Source: https://betterstack.com/community/guides/logging/best-nodejs-logging-libraries/
# Original language: javascript
# Normalized: js
# Block index: 29

const logger = require('tracer').colorConsole({
  format: [
    '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})', //default format
    {
      error:
        '{{timestamp}} <{{title}}> {{message}} (in {{file}}:{{line}})\nCall Stack:\n{{stack}}' // error format
    }
  ],
  dateformat: 'HH:MM:ss.L',
})