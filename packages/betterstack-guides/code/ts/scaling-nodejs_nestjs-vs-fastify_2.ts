# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-fastify/
# Original language: typescript
# Normalized: ts
# Block index: 2

[label posts.controller.ts]
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }
}