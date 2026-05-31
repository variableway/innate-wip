# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/
# Original language: php
# Normalized: php
# Block index: 38

<?php

class emptyClass
{
    // This class is empty
};

try {
  // Try to access a method that does not exist
  emptyClass::one();
} catch (Error $e) {
  // exception handling code here
}
?>