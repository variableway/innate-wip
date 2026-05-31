# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-java/
# Original language: java
# Normalized: java
# Block index: 21

[label Main.java]
  package org.example;

  import org.slf4j.Logger;
  import org.slf4j.LoggerFactory;
  import org.slf4j.MDC;

  public class Main {
      public static void main(String[] args) {

          Logger logger = LoggerFactory.getLogger(Main.class);

          MDC.put("username", "jack");
          MDC.put("password", "12345");
          logger.info("New user created.");

      }
  }