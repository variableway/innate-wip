# Source: https://betterstack.com/community/guides/scaling-nodejs/web-apis-with-hapijs/
# Original language: javascript
# Normalized: js
# Block index: 33

[label src/routes/posts.js]
export const postRoutes = [
    // Previous routes...

[highlight]
    {
        method: 'DELETE',
        path: '/api/posts/{id}',
        options: {
            validate: {
                params: postParamsSchema
            },
            tags: ['api', 'posts'],
            description: 'Delete a specific blog post'
        },
        handler: async (request, h) => {
            try {
                const result = await postController.deletePost(request.params.id);
                return h.response(result).code(200);
            } catch (error) {
                return error;
            }
        }
    }
[/highlight]
];