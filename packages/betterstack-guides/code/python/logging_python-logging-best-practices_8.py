# Source: https://betterstack.com/community/guides/logging/python-logging-best-practices/
# Original language: python
# Normalized: python
# Block index: 8

def low_memory_check():
    available_memory = get_available_memory()
    if available_memory < 1024:
        logger.warning('Low memory detected')
        # Send an alert to the you