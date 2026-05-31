# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 19

[label Dockerfile]
FROM quay.io/quarkus/ubi-quarkus-mandrel:21.3-java17 AS builder
WORKDIR /app
COPY . .
RUN ./mvnw package -Pnative

FROM quay.io/quarkus/quarkus-micro-image:1.0
WORKDIR /app
COPY --from=builder /app/target/*-runner /app/application
RUN chmod 775 /app
EXPOSE 8080
CMD ["./application", "-Dquarkus.http.host=0.0.0.0"]