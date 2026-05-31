# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-spring-boot/
# Original language: typescript
# Normalized: ts
# Block index: 2

[label products.service.ts]
@Injectable()
export class ProductsService {
  private products: Product[] = [];

  create(createProductDto: CreateProductDto): Product {
    const product = {
      id: Date.now().toString(),
      ...createProductDto,
      createdAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  findAll(): Product[] {
    return this.products;
  }
}