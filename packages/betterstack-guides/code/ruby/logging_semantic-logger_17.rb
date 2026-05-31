# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 17

logger.silence(:warn) do
 logger.warn "warning message" # This will be logged
end