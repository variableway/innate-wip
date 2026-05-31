# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 45

handler = MyHandler()
handler.push_application()
# everything logged here here goes to that handler
handler.pop_application()