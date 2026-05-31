# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-spring-boot/
# Original language: java
# Normalized: java
# Block index: 22

[label ProductControllerIntegrationTest.java]
@SpringBootTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class ProductControllerIntegrationTest {
    @Autowired
    private TestRestTemplate restTemplate;

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:14")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @Test
    void shouldCreateProduct() {
        CreateProductRequest request = new CreateProductRequest(
            "Integration Test Product", "Description", new BigDecimal("149.99")
        );

        ResponseEntity<Product> response = restTemplate.postForEntity(
            "/products", request, Product.class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getName()).isEqualTo("Integration Test Product");
    }
}