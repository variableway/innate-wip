# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/
# Original language: python
# Normalized: python
# Block index: 34

[label horus/views/search.py]
. . .
[highlight]
logger = logging.getLogger('horus.views.search')
[/highlight]

def search(request):
    if request.method != 'POST':
        [highlight]
        logger.info(
            'Invalid access made to /search, redirecting to /')
        [/highlight]
        return redirect('/')

    [highlight]
    logger.info(f'User {request.session["id"]} has navigated to /search')
    [/highlight]

    location = request.POST['location']

    [highlight]
    logger.info(f'User {request.session["id"]} searched for {location}')
    [/highlight]

    try:
        locations = search_countries(location)
        return render(request, 'search.html', {'success': True, 'search': location, 'results': locations})
    except OpenWeatherError:
        [highlight]
        logger.error(
            'Unable to retrieve matching locations for search', exc_info=True)
        [/highlight]
        return render(request, 'search.html', {'success': False})