# Source: https://betterstack.com/community/guides/logging/python-logging-best-practices/
# Original language: python
# Normalized: python
# Block index: 14

data = [1, 2, 3, 4, 5]

  if len(data) < 6:
    logging.warning("Data is too small. Consider collecting more data before proceeding.")
  else:
    # process data
    pass