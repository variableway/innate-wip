# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-spring-boot/
# Original language: java
# Normalized: java
# Block index: 18

[label ProductService.java]
@Service
@Transactional(readOnly = true)
public class ProductService {
    @Transactional
    public Product create(CreateProductRequest request) {
        Product product = new Product(
            request.getName(),
            request.getDescription(),
            request.getPrice()
        );
        return productRepository.save(product);
    }

    public Page<Product> findWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return productRepository.findAll(pageable);
    }
}