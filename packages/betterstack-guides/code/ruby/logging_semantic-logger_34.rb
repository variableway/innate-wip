# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 34

logger.measure_info 'I took more than a second', min_duration: 1000 do
  # log only if this block takes more than a second to run
end