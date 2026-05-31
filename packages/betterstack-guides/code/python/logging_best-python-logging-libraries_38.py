# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 38

def calculate(x, y):
    with start_action(action_type="multiply") as ctx:
        ctx.log(message_type="mymsg", msg="a standalone message")
        return x * y