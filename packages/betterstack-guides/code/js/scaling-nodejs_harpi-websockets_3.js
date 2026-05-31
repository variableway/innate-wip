# Source: https://betterstack.com/community/guides/scaling-nodejs/harpi-websockets/
# Original language: javascript
# Normalized: js
# Block index: 3

[label server.js]
import Hapi from '@hapi/hapi';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost'
    });

    // Register static file plugin
    await server.register(Inert);

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();