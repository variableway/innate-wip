# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 0

# Asynchronous mode (Default)
class OrderService
  def process_order
    logger.info("Starting order processing")  # Returns immediately
    # Code continues while log writes in background
  end
end