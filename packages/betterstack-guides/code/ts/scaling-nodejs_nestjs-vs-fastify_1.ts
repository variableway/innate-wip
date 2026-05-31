# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-fastify/
# Original language: typescript
# Normalized: ts
# Block index: 1

[label posts.service.ts]
@Injectable()
export class PostsService {
  private posts = [{ id: '1', title: 'First Post' }];

  findAll() {
    return this.posts;
  }

  create(createPostDto: CreatePostDto) {
    const post = { id: Date.now().toString(), ...createPostDto };
    this.posts.push(post);
    return post;
  }
}