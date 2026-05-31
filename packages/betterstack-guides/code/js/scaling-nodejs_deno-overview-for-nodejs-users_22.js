# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-overview-for-nodejs-users/
# Original language: javascript
# Normalized: js
# Block index: 22

[label app.js]
import * as log from "@std/log";

log.debug("Debugging the application initialization.");
log.info("User ID 123456 logged in.");
log.critical("Critical failure: 500 Internal Server Error.");