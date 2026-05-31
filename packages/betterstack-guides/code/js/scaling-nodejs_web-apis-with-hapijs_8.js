# Source: https://betterstack.com/community/guides/scaling-nodejs/web-apis-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 8

[label server.js]
import Hapi from '@hapi/hapi';
[highlight]
import { connectDatabase, disconnectDatabase } from './src/utils/database.js';
[/highlight]

const init = async () => {
[highlight]
    // Connect to MongoDB before starting server
    await connectDatabase();
[/highlight]

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'],
                headers: ['Accept', 'Content-Type'],
                additionalHeaders: ['X-Requested-With']
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return { message: 'Welcome to the Hapi.js Blog API' };
        }
    });

[highlight]
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        console.log('Shutting down server...');
        await server.stop();
        await disconnectDatabase();
        process.exit(0);
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