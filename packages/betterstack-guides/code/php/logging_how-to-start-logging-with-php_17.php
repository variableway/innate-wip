# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-php/
# Original language: php
# Normalized: php
# Block index: 17

[label logging.php]
<?php
trigger_error("A user requested a resource.", E_USER_NOTICE);
trigger_error("The image failed to load!", E_USER_WARNING);
trigger_error("User requested a profile that doesn't exist!", E_USER_ERROR);
?>