# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4j/
# Original language: java
# Normalized: java
# Block index: 30

[label App.java]
package com.example;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
[highlight]
import org.apache.logging.log4j.ThreadContext;
[/highlight]

public class App {

    protected static final Logger logger = LogManager.getLogger();

    public static void main(String[] args) {
        [highlight]
        ThreadContext.put("orderNumber", "1234567890");
        ThreadContext.put("buyerName", "jack");
        ThreadContext.put("destination", "xxxxxxxxxx");

        logger.info("Order shipped successfully.");

        ThreadContext.clearAll();
        [/highlight]
    }
}