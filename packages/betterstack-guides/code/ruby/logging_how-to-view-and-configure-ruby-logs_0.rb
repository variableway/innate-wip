# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/
# Original language: ruby
# Normalized: ruby
# Block index: 0

require 'logger'

logger = Logger.new($stdout) # create a new logger that writes to the console

logger.info('Starting application...')

# ... application code here ...

logger.error('An error occurred!')

# ... more application code ...

logger.info('Shutting down application...')