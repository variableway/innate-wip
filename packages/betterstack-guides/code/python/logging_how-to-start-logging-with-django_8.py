# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/
# Original language: python
# Normalized: python
# Block index: 8

[label horus/views/search.py]
# ...

def search(request):
    if request.method != 'POST':
        return redirect('/')

    location = request.POST['location']

    try:
        locations = search_countries(location)
        return render(request, 'search.html', {'success': True, 'search': location, 'results': locations})
    except OpenWeatherError:
        return render(request, 'search.html', {'success': False})