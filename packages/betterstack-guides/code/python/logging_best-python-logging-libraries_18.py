# Source: https://betterstack.com/community/guides/logging/best-python-logging-libraries/
# Original language: python
# Normalized: python
# Block index: 18

from loguru import logger
import uuid

def logging_middleware(get_response):
    def middleware(request):
        request_id = str(uuid.uuid4())

[highlight]
        with logger.contextualize(request_id=request_id):
[/highlight]
            response = get_response(request)
            response["X-Request-ID"] = request_id
            return response

    return middleware