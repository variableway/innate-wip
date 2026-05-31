# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 9

class Device
[highlight]
  include SemanticLogger::Loggable
[/highlight]

  def perform_operation
    logger.info('Operation completed')
  end
end

device = Device.new
device.perform_operation