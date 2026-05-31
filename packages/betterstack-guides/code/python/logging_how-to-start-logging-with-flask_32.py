# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-flask/
# Original language: python
# Normalized: python
# Block index: 32

[label app.py]
. . .
@app.after_request
def logAfterRequest(response):

    app.logger.info(
        "path: %s | method: %s | status: %s | size: %s >>> %s",
        request.path,
        request.method,
        response.status,
        response.content_length,
        session["ctx"],
    )

    return response