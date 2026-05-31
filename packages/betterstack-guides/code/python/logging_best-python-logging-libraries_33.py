# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 33

from eliot import log_call, to_file

to_file(sys.stdout)


@log_call
def calculate(x, y):
    return x * y


calculate(10, 5)