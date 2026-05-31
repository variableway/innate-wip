# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-laravel/
# Original language: typescript
# Normalized: ts
# Block index: 16

describe('PostsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should create post when authenticated', () => {
    return request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', 'Bearer ' + validToken)
      .send({ title: 'Test Post', content: 'Test content' })
      .expect(201)
      .expect(res => {
        expect(res.body.title).toBe('Test Post');
      });
  });
});