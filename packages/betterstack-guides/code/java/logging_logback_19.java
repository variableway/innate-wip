# Source: https://betterstack.com/community/guides/logging/logback/
# Original language: java
# Normalized: java
# Block index: 19

[label App.java]
package com.example;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
[highlight]
import org.slf4j.MDC;
[/highlight]

public class App {

    private static final Logger logger = LoggerFactory.getLogger(App.class);

    public static void main(String[] args) {
        [highlight]
        // Add new items
        MDC.put("orderNumber", "1234567890");

        logger.info("Order placed.");

        MDC.put("buyerName", "jack");
        MDC.put("destination", "xxxxxxxxxx");

        logger.info("Order shipped successfully.");

        // Remove items
        MDC.remove("buyerName");
        MDC.remove("destination");

        logger.warn("Order shipment failed.");

        // Clear all items
        MDC.clear();
        [/highlight]
    }
}