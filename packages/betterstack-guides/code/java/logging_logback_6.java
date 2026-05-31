# Source: https://betterstack.com/community/guides/logging/logback/
# Original language: java
# Normalized: java
# Block index: 6

[label App.java]
package com.example;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

public class App {
    private static final Logger logger = LoggerFactory.getLogger(App.class);

    public static void main(String[] args) {
        [highlight]
        logger.trace("Entering method foo()");
        logger.debug("Received request from 198.12.34.56");
        logger.info("User logged in: john");
        logger.warn("Connection to server lost. Retrying...");
        logger.error("Failed to write data to file: myFile.txt");
        [/highlight]
    }
}