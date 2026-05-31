# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 18

[label Dockerfile]
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY . .
RUN ./mvnw spring-boot:build-image -Dspring-boot.build-image.imageName=my-app

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Extract the layers from the builder image
COPY --from=builder /app/target/layers/dependencies/ ./
COPY --from=builder /app/target/layers/spring-boot-loader/ ./
COPY --from=builder /app/target/layers/snapshot-dependencies/ ./
COPY --from=builder /app/target/layers/application/ ./
EXPOSE 8080
CMD ["java", "org.springframework.boot.loader.JarLauncher"]