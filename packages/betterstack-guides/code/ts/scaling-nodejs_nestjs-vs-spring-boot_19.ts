# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-spring-boot/
# Original language: typescript
# Normalized: ts
# Block index: 19

[label products.service.spec.ts]
describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should create a product', async () => {
    const productData = { name: 'Test Product', description: 'Test', price: 99.99 };
    const savedProduct = { id: 1, ...productData, createdAt: new Date() };

    jest.spyOn(repository, 'create').mockReturnValue(savedProduct as Product);
    jest.spyOn(repository, 'save').mockResolvedValue(savedProduct as Product);

    const result = await service.create(productData);
    expect(result).toEqual(savedProduct);
  });
});