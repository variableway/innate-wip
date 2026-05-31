# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 29

import sys
from eliot import start_action, to_file

to_file(sys.stdout)


def calculate(x, y):
    with start_action(action_type="multiply"):
        return x * y


calculate(10, 5)