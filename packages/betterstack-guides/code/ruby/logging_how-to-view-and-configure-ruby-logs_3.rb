# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/
# Original language: ruby
# Normalized: ruby
# Block index: 3

logger.debug('Started processing request for user 1234')
logger.info('Server started on port 3000')
logger.warn('Disk space low: only 5% remaining on /dev/sda1')
logger.error('Failed to write to file /var/log/application.log: permission denied')
logger.fatal('Fatal error: could not connect to database at localhost:3306')