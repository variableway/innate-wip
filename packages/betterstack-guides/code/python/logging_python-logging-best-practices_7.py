# Source: https://betterstack.com/community/guides/logging/python-logging-best-practices/
# Original language: python
# Normalized: python
# Block index: 7

def process_request(request):
    try:
        # Process the request
    except Exception as e:
        logger.error('Error processing request: %s', e, exc_info=True)
        # Return an error message to the user