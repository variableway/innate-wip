# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 40

def calculate(x, y):
    with start_action(action_type="multiply", level="INFO") as ctx:
        ctx.log(message_type="mymsg", msg="a standalone message", level="INFO")
        return x * y