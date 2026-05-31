# Source: https://betterstack.com/community/guides/logging/sensitive-data/
# Original language: java
# Normalized: java
# Block index: 1

[label LogGenerator.java]
package com.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LogGenerator {
    private static Logger LOGGER = LoggerFactory.getLogger(LogGenerator.class);

    public void generateLogs(String msg) {
        LOGGER.trace(msg);
        LOGGER.debug(msg);
        LOGGER.info(msg);
        LOGGER.warn(msg);
        LOGGER.error(msg);
    }
}