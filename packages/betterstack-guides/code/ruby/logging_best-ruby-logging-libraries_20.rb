# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 20

SemanticLogger.tagged(username: 'John', user_id: 123_456) do
  # All log entries in this block will include the above named tags
  logger.debug('user signed in')
  logger.debug('user opened document', doc_id: 'xyz')
  logger.debug('user signed out')
end