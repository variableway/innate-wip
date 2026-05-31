# Source: https://betterstack.com/community/guides/scaling-nodejs/file-uploads-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 3

[label server.js]
import Hapi from '@hapi/hapi';

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/',
    handler: () => {
        return { message: 'Hapi.js File Upload Server is running' };
    }
});

const start = async () => {
    try {
        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

start();