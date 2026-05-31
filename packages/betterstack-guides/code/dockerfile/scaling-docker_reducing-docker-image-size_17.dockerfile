# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 17

[label Dockerfile]
FROM eclipse-temurin:17 AS builder
WORKDIR /app
COPY . .
RUN ./mvnw package
# Create custom JRE
RUN jlink \
    --add-modules $(jdeps --print-module-deps target/app.jar),jdk.crypto.ec \
    --strip-debug \
    --no-man-pages \
    --no-header-files \
    --compress=2 \
    --output /customjre

FROM alpine:3.16
WORKDIR /app
# Copy custom JRE and application
COPY --from=builder /customjre /opt/java/openjdk
COPY --from=builder /app/target/app.jar /app/app.jar
ENV PATH="/opt/java/openjdk/bin:$PATH"
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]