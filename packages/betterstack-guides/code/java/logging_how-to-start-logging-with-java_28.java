# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-java/
# Original language: java
# Normalized: java
# Block index: 28

[label Main.java]
package org.example;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

public class Main {
    public static void main(String[] args) {

        Logger logger = LoggerFactory.getLogger(Main.class);

        try
        {
            // do something here that might throw an exception
            int[] myNumbers = {1, 2, 3};
            System.out.println(myNumbers[10]);
        }
        catch (Exception e)
        {
            logger.error("An exception has been caught.", e);
        }
    }
}