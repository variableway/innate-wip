# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-spring-boot/
# Original language: java
# Normalized: java
# Block index: 15

[label application.yml]
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/enterprise_db
    username: user
    password: password
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect