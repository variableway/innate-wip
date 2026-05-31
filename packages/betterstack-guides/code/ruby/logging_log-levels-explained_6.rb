# Source: https://betterstack.com/community/guides/logging/log-levels-explained/
# Original language: ruby
# Normalized: ruby
# Block index: 6

require 'semantic_logger'

SemanticLogger.add_appender(io: $stdout, formatter: :json)

logger = SemanticLogger['MyApp']

[highlight]
logger.info('API request to /api/v1/users completed successfully',
            method: 'GET', status_code: 200, elapsed_ms: 212, endpoint: '/api/v1/users')
[/highlight]