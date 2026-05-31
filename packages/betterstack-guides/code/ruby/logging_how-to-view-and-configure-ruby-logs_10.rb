# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/
# Original language: ruby
# Normalized: ruby
# Block index: 10

class CustomLogger < Logger
  TRACE = Logger::DEBUG - 1

  SEV_LABEL = {
    -1 => 'TRACE',
    0 => 'DEBUG',
    1 => 'INFO',
    2 => 'WARN',
    3 => 'ERROR',
    4 => 'FATAL'
  }.freeze

  def format_severity(severity)
    SEV_LABEL[severity] || 'ANY'
  end

  def trace(message)
    add(TRACE, message)
  end
end

logger = CustomLogger.new($stdout)
logger.level = CustomLogger::TRACE

logger.trace('Entering "calculate" method with arguments: x=5, y=10')