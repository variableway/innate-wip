# Source: https://betterstack.com/community/guides/logging/logback/
# Original language: java
# Normalized: java
# Block index: 2

[label App.java]
package com.example;

[highlight]
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
[/highlight]

public class App {
    [highlight]
    private static final Logger logger = LoggerFactory.getLogger(App.class);
    [/highlight]

    public static void main(String[] args) {
        [highlight]
        logger.info("This is an info message.");
        [/highlight]
    }
}