# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-spring-boot/
# Original language: java
# Normalized: java
# Block index: 21

[label ProductServiceTest.java]
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void shouldCreateProduct() {
        CreateProductRequest request = new CreateProductRequest(
            "Test Product", "Test Description", new BigDecimal("99.99")
        );
        Product savedProduct = new Product(1L, "Test Product", "Test Description", 
            new BigDecimal("99.99"), LocalDateTime.now());

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        Product result = productService.create(request);

        assertThat(result.getName()).isEqualTo("Test Product");
        assertThat(result.getPrice()).isEqualTo(new BigDecimal("99.99"));
    }
}