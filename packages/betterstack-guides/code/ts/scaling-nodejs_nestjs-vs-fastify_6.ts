# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-fastify/
# Original language: typescript
# Normalized: ts
# Block index: 6

[label posts.controller.ts]
@Controller('posts')
export class PostsController {
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }
}