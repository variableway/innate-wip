# Source: https://betterstack.com/community/guides/scaling-nodejs/harpi-websockets/
# Original language: javascript
# Normalized: js
# Block index: 6

[label server.js]
import Hapi from '@hapi/hapi';
[highlight]
import Inert from '@hapi/inert';
[/highlight]
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost'
    });

    await server.register(Inert);

    [highlight]
    // Serve static files
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: join(__dirname, 'public'),
                index: ['index.html']
            }
        }
    });
    [/highlight]

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();