# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4j/
# Original language: java
# Normalized: java
# Block index: 2

[label src/main/java/com/example/App.java]
package com.example;

[highlight]
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
[/highlight]

/**
 * Hello world!
 *
 */
public class App {
    protected static final Logger logger = LogManager.getLogger();

    public static void main(String[] args) {

        [highlight]
        logger.info("Hello World!");
        [/highlight]

    }
}