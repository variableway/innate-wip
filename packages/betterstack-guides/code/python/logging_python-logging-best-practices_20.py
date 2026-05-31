# Source: https://betterstack.com/community/guides/logging/python-logging-best-practices/
# Original language: python
# Normalized: python
# Block index: 20

[label main.py]
import logging_config
import logging

logger = logging.getLogger(__name__)

credit_card_number = "1234-5678-9012-3456"
logger.info(f"User made a payment with credit card number: {credit_card_number}")