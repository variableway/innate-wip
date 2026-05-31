# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 21

logger.info('User logged in', { user_id: user.id, ip: request.remote_ip, session_id: session.id })