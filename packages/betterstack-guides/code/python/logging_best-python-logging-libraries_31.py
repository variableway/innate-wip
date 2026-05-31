# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 31

def calculate(x, y):
    # additional fields here are added to the start message of the action alone
    [highlight]
    with start_action(action_type="multiply", x=x, y=y) as action:
    [/highlight]
        result = x * y
        # fields added here show up only in the success message of the action
        [highlight]
        action.add_success_fields(result=result)
        [/highlight]
        return result