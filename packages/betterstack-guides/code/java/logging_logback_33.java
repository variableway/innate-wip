# Source: https://betterstack.com/community/guides/logging/logback/
# Original language: java
# Normalized: java
# Block index: 33

[label App.java]
package com.example;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;

public class App {

    private static final Logger logger = LoggerFactory.getLogger(App.class);
    private static final Marker FATAL_MARKER = MarkerFactory.getMarker("FATAL");
    private static final Marker IMPORTANT_MARKER = MarkerFactory.getMarker("IMPORTANT");

    public static void main(String[] args) {
        [highlight]
        logger.error(IMPORTANT_MARKER, "Failed to write data to file: myFile.txt");
        logger.error(FATAL_MARKER, "System crushed. Shutting down...");
        [/highlight]
    }
}