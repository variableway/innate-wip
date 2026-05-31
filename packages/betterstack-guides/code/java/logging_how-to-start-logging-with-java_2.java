# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-java/
# Original language: java
# Normalized: java
# Block index: 2

[label Main.java]
package org.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main {
    public static void main(String[] args) {

        Logger logger = LoggerFactory.getLogger(Main.class);

        logger.info("Hello world!");

    }
}