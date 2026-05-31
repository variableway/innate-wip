# Source: https://betterstack.com/community/guides/monitoring/java-prometheus/
# Original language: java
# Normalized: java
# Block index: 13

package com.example.demo.filter;

import io.micrometer.core.instrument.Counter;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class MetricsFilter extends OncePerRequestFilter {
    private final Counter requestCounter;

    public MetricsFilter(Counter requestCounter) {
        this.requestCounter = requestCounter;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) {
        requestCounter.increment();  // Increment before processing the request
        filterChain.doFilter(request, response);
    }
}