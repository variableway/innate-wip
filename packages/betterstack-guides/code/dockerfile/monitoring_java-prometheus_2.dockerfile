# Source: https://betterstack.com/community/guides/monitoring/java-prometheus/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 2

[label Dockerfile]
FROM eclipse-temurin:17-jdk-focal

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN ./mvnw dependency:go-offline

COPY src ./src

CMD ["./mvnw", "spring-boot:run"]