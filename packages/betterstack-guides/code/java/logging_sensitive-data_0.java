# Source: https://betterstack.com/community/guides/logging/sensitive-data/
# Original language: java
# Normalized: java
# Block index: 0

[label TestAppender.java]
package com.example;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;

public class TestAppender extends ListAppender<ILoggingEvent> {
    public void reset() {
        this.list.clear();
    }

    public boolean contains(String string) {
        return this.list.stream()
          .anyMatch(event → event.toString().contains(string));
    }
}