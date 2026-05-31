# Source: https://betterstack.com/community/guides/logging/python-logging-best-practices/
# Original language: python
# Normalized: python
# Block index: 10

def get_user_info(user_id):
    logger.debug('Retrieving user info for user with ID: %s', user_id)
    # Fetch user info from the database
    user_info = database.get_user_info(user_id)
    logger.debug('Retrieved user info: %s', user_info)
    return user_info