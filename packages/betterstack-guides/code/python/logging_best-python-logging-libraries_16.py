# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 16

child = logger.bind(user_id="USR-1243", doc_id="DOC-2348")
child.debug("Processing document")
child.warning("Invalid configuration detected. Falling back to defaults")
child.success("Document processed successfully")