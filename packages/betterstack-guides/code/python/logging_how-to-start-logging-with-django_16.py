# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/
# Original language: python
# Normalized: python
# Block index: 16

[label horus/views/index.py]
def index(request):
    request.session['id'] = str(uuid.uuid4())

[highlight]
    logger.info(f'New user with ID: {request.session["id"]}')
[/highlight]

    return render(request, 'index.html', {})