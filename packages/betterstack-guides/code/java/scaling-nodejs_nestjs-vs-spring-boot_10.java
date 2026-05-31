# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-spring-boot/
# Original language: java
# Normalized: java
# Block index: 10

[label ProductController.java]
@RestController
@RequestMapping("/products")
@Validated
public class ProductController {
    @PostMapping
    public ResponseEntity<Product> createProduct(
        @Valid @RequestBody CreateProductRequest request) {
        Product product = productService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }
}