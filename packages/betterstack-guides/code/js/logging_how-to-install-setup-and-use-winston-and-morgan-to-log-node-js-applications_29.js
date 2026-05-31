# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/
# Original language: javascript
# Normalized: js
# Block index: 29

// fired when a log file is created
fileRotateTransport.on('new', (filename) => {});
// fired when a log file is rotated
fileRotateTransport.on('rotate', (oldFilename, newFilename) => {});
// fired when a log file is archived
fileRotateTransport.on('archive', (zipFilename) => {});
// fired when a log file is deleted
fileRotateTransport.on('logRemoved', (removedFilename) => {});