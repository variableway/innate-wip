# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-spring-boot/
# Original language: typescript
# Normalized: ts
# Block index: 20

[label products.controller.e2e-spec.ts]
describe('ProductsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/products (POST)', () => {
    return request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Test Product', description: 'Test', price: 99.99 })
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toBe('Test Product');
      });
  });
});