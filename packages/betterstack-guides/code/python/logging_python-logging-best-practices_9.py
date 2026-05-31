# Source: https://betterstack.com/community/guides/logging/python-logging-best-practices/
# Original language: python
# Normalized: python
# Block index: 9

def some_function(record_id):
    # Do some processing
    logger.info('New record created in the database. ID: %s', record_id)