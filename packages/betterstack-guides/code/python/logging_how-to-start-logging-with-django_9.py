# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-django/
# Original language: python
# Normalized: python
# Block index: 9

[label horus/openweather.py]
# ...

def search_countries(search, limit=5):
[highlight]
    response = __request__(
        'http://api.openweathermap.org/geo/1.0/direct',
        {'q': search, 'limit': limit}
    )
[/highlight]

    if not response.ok or len(response.json()) == 0:
        raise OpenWeatherError(
            'OpenWeather could not find matching locations - response not OK or response is empty')

    locations = [{
        'name': location['name'],
        'lat': location['lat'],
        'lon': location['lon'],
        'country': pycountry.countries.get(alpha_2=location['country']).name,
        'state': location['state'] if 'state' in location else ''
    } for location in response.json()]

    return locations


def get_current_weather(location, lat, lon):
[highlight]
    response = __request__(
        'https://api.openweathermap.org/data/2.5/weather',
        {'lat': lat, 'lon': lon, 'units': 'metric'}
    )
[/highlight]

    if not response.ok:
        raise OpenWeatherError(
            'OpenWeather could not find the weather of the location - response not OK')

    weather = {
        'current': response.json()['weather'][0]['description'].lower(),
        'temp': response.json()['main']['temp'],
        'feels_like': response.json()['main']['feels_like'],
        'location': location
    }

    return weather