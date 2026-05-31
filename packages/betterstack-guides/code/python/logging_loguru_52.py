# Source: https://betterstack.com/community/guides/logging/loguru/
# Original language: python
# Normalized: python
# Block index: 52

[label worldClock/middleware.py]
from loguru import logger
import uuid
import time

def logging_middleware(get_response):
    def middleware(request):
        # Create a request ID
        request_id = str(uuid.uuid4())

        # Add context to all loggers in all views
        with logger.contextualize(request_id=request_id):

            request.start_time = time.time()

            response = get_response(request)

            elapsed = time.time() - request.start_time

            # After the response is received
            logger.bind(
                path=request.path,
                method=request.method,
                status_code=response.status_code,
                response_size=len(response.content),
                elapsed=elapsed,
            ).info(
                "incoming '{method}' request to '{path}'",
                method=request.method,
                path=request.path,
            )

            response["X-Request-ID"] = request_id

            return response

    return middleware