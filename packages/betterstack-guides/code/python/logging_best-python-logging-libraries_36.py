# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 36

import sys
from eliot import log_call, to_file

to_file(sys.stdout)


[highlight]
@log_call
def calculate(x, y):
    return x / y
[/highlight]


try:
    calculate(1, 0)
except ZeroDivisionError as e:
    print("division by zero detected")