# Source: https://betterstack.com/community/guides/logging/logback/
# Original language: java
# Normalized: java
# Block index: 26

package com.example;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
[highlight]
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;
[/highlight]

public class App {

    private static final Logger logger = LoggerFactory.getLogger(App.class);
    [highlight]
    private static final Marker FATAL_MARKER = MarkerFactory.getMarker("FATAL");
    [/highlight]

    public static void main(String[] args) {
        [highlight]
        logger.error(FATAL_MARKER, "System crushed. Shutting down...");
        [/highlight]
    }
}