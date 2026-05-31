# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-log4j/
# Original language: java
# Normalized: java
# Block index: 13

logger.trace("Entering method processOrder().");
logger.log(Level.getLevel("VERBOSE"), "Executing method foo() with parameters: [param1, param2]");
logger.debug("Received order with ID 12345.");
logger.info("Order shipped successfully.");
logger.warn("Potential security vulnerability detected in user input: '...'");
logger.error("Failed to process order. Error: {. . .}");
logger.fatal("System crashed. Shutting down...");