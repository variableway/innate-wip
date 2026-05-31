# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4j/
# Original language: java
# Normalized: java
# Block index: 11

[label App.java]
package com.example;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
[highlight]
import org.apache.logging.log4j.Level;
[/highlight]

public class App {
    protected static final Logger logger = LogManager.getLogger();

    public static void main(String[] args) {
        [highlight]
        logger.log(Level.getLevel("VERBOSE"), "a verbose message");
        [/highlight]
    }
}