# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4j/
# Original language: java
# Normalized: java
# Block index: 8

[label App.java]
package com.example;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
[highlight]
import org.apache.logging.log4j.Level;
[/highlight]

public class App {
    [highlight]
    final Level VERBOSE = Level.forName("VERBOSE", 550);
    [/highlight]

    protected static final Logger logger = LogManager.getLogger();

    public static void main(String[] args) {
        [highlight]
        App app = new App();
        logger.log(app.VERBOSE, "a verbose message");
        [/highlight]
    }
}