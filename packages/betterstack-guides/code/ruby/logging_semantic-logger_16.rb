# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 16

# Silence all logging below :error level
logger.silence do
 logger.info "This will not be logged"
 logger.warn "Neither will this"
 logger.error "But errors will be logged!"
end