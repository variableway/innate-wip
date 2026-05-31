# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/
# Original language: ruby
# Normalized: ruby
# Block index: 31

# import and set up the logger
. . .
user_id = 1283
transaction_id = SecureRandom.uuid

logger.info('Hello from Ougai logger')

child_logger = logger.child({user_id:, transaction_id:})
# log transaction start
child_logger.info('Transaction started')

# perform some transaction steps
child_logger.debug('Payment processing', { order_id: '12345', payment_method: 'credit_card' })
child_logger.debug('Order fulfillment', { order_id: '12345', shipping_method: 'standard' })

# log transaction end
child_logger.info('Transaction completed')