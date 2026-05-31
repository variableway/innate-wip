# Source: https://betterstack.com/community/guides/scaling-nodejs/web-apis-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 14

[label server.js]
import Hapi from '@hapi/hapi';
import { connectDatabase, disconnectDatabase } from './src/utils/database.js';
[highlight]
import { postRoutes } from './src/routes/posts.js';
[/highlight]

const init = async () => {
    await connectDatabase();

    const server = Hapi.server({
        ..
    });

[highlight]
    // Register all post routes
    server.route(postRoutes);
[/highlight]

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return { message: 'Welcome to the Hapi.js Blog API' };
        }
    });

...