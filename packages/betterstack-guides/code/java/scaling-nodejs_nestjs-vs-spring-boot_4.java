# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-spring-boot/
# Original language: java
# Normalized: java
# Block index: 4

[label Product.java]
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private String description;

    @Positive
    private BigDecimal price;

    @CreationTimestamp
    private LocalDateTime createdAt;

    // constructors, getters, setters
}