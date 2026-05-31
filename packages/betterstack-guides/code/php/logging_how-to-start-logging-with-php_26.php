# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-php/
# Original language: php
# Normalized: php
# Block index: 26

openlog("MyAppPrefix", LOG_PID | LOG_PERROR,LOG_USER);
syslog(LOG_ERR, "Custom error message");
closelog();