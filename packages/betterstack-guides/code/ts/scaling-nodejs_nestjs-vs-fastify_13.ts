# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-fastify/
# Original language: typescript
# Normalized: ts
# Block index: 13

[label posts.service.spec.ts]
describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: mockRepository }
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should create a post', async () => {
    const postData = { title: 'Test', content: 'Content' };
    const result = await service.create(postData);
    expect(result.title).toBe(postData.title);
  });
});