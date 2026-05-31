# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 4

# Synchronous (After SemanticLogger.sync!)
class OrderService
  def process_order
    logger.info("Starting order processing")  # Waits for log to be written
    # Code continues only after log is written
  end
end