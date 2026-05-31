# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 52

# Dynamic context method chaining
logger.query('SELECT 1;').duration('200ms').debug('database query executed')
# Using contextual arguments directly on the level method
logger.info('user signed in', username: 'johndoe', user_id: 123_456)
# Passing an explicit context
logger.context(space_used: '1234278MB', space_remaining: '100MB').warn('disk space is 95% full')