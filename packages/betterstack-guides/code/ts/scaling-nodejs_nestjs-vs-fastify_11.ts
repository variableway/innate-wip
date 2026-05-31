# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-fastify/
# Original language: typescript
# Normalized: ts
# Block index: 11

[label posts.controller.ts]
// Enable compression
app.use(compression());

// Use caching interceptor
@UseInterceptors(CacheInterceptor)
@CacheTTL(30)
@Get()
findAll() {
  return this.postsService.findAll();
}