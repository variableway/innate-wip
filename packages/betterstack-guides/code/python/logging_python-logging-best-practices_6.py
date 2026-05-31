# Source: https://betterstack.com/community/guides/logging/python-logging-best-practices/
# Original language: python
# Normalized: python
# Block index: 6

def connect_to_database():
      try:
          # connect here
      except Exception as e:
          logger.critical("Failed to connect to database: %s", e,  exc_info=True)
          exit(1)
      return conn