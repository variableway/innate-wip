# Source: https://betterstack.com/community/guides/logging/logback/
# Original language: java
# Normalized: java
# Block index: 31

[label MarkerFilter.java]
package com.example;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.filter.Filter;
import ch.qos.logback.core.spi.FilterReply;
import org.slf4j.Marker;
import org.slf4j.MarkerFactory;

public class MarkerFilter extends Filter<ILoggingEvent> {
    @Override
    public FilterReply decide(ILoggingEvent event) {

        Marker markerToMatch = MarkerFactory.getMarker("FATAL");

        if (event.getMarkerList().contains(markerToMatch)) {
            return FilterReply.ACCEPT;
        } else {
            return FilterReply.DENY;
        }
    }
}