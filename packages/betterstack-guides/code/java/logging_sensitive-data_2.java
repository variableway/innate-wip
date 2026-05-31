# Source: https://betterstack.com/community/guides/logging/sensitive-data/
# Original language: java
# Normalized: java
# Block index: 2

[label AppTest.java]
package com.example;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;
import org.slf4j.LoggerFactory;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.LoggerContext;

/**
 * Unit test for simple App.
 */
public class AppTest {
    private TestAppender testAppender;
    private static final String MSG = "Order shipped. Destination: xxxxxxxxxx";

    @Before
    public void setup() {
        Logger logger = (Logger) LoggerFactory.getLogger(Logger.ROOT_LOGGER_NAME);
        testAppender = new TestAppender();
        testAppender.setContext((LoggerContext) LoggerFactory.getILoggerFactory());
        logger.setLevel(Level.DEBUG);
        logger.addAppender(testAppender);
        testAppender.start();
    }

    @Test
    public void test() {
        LogGenerator worker = new LogGenerator();
        worker.generateLogs(MSG);

        assertFalse(testAppender.contains("Destination"));
        // assertTrue(testAppender.contains("Destination"));
    }
}