# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-java/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 2

FROM eclipse-temurin:17-jdk-focal

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN ./mvnw dependency:go-offline

COPY src ./src

CMD ["./mvnw", "spring-boot:run"]