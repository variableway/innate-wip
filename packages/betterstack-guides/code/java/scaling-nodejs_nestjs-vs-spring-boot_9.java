# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-spring-boot/
# Original language: java
# Normalized: java
# Block index: 9

[label CreateProductRequest.java]
public class CreateProductRequest {
    @NotBlank
    @Size(min = 3, max = 100)
    private String name;

    @NotBlank
    @Size(min = 10, max = 500)
    private String description;

    @DecimalMin(value = "0.01")
    @Digits(integer = 6, fraction = 2)
    private BigDecimal price;

    // constructors, getters, setters
}