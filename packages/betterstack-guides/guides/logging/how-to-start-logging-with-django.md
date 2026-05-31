# How to Get Started with Logging in Django

In a previous article, we dived into the [fundamentals of logging in
Python](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/) using the built-in `logging` module.
This tutorial will build on those fundamentals by exploring how they are applied
in a real-world application built using
[Django](https://www.djangoproject.com/), a Python web framework that aids with
the rapid design and development of web applications.

By following through with this tutorial, you will gain an understanding of the
following concepts:

1. Setting up a logging system that is independent of Django.
2. Using the built-in logging system in Django.
3. Integrating Django projects with a log aggregation service.

[summary]

## Side note: Get a Python logs dashboard

Save hours of sifting through Python logs. Centralize with [Better Stack](https://betterstack.com/logs) and start visualizing your log data in minutes.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/xmqvQqPkH24" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

[/summary]

## Prerequisites

While this article explains its concepts in detail, we recommend reading the
previous article which discusses the [fundamentals of logging in
Python](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/) as basic concepts such as
understanding the use cases of logging and writing meaningful log messages were
covered in that article. However, this is optional if you're already familiar
with Python's `logging` module.

To follow through with this article, you should install the latest version of
Python on your machine. If you are missing Python, you can
[find the installation instructions here](https://docs.python.org/3/using/index.html).

You will also need SQLite. Some machines come with SQLite pre-installed, but you
can
[find the installation instructions here](https://www.servermania.com/kb/articles/install-sqlite/)
if you don't have it already.

Finally,
[clone the sample code repository](https://github.com/betterstack-community/horus)
and set up the project on your machine:

```command
git clone https://github.com/betterstack-community/horus.git
```

```command
cd horus/
```

Create a virtual environment:

```command
python3 -m venv venv
```

Activate the virtual environment:

```command
source venv/bin/activate
```

Install dependencies:

```command
pip install -r requirements.txt
```

Afterward, you should sign up for a free
[OpenWeather account](https://openweathermap.org/) as our sample application
relies on it to function. Your OpenWeather API key can be
[accessed from here](https://home.openweathermap.org/api_keys):

![OpenWeather API Key](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/27e9cd1c-2f4f-4bd7-11e4-01dc67228100/public =1312x375)

Copy the key and add the following file and add it to a `.env` file at the root
of your project:

```text
[label .env]
OPEN_WEATHER_API_KEY=<api key>
```

Now, run the Django migrations to set up your database:

```command
python manage.py migrate
```

Launch the application:

```command
python manage.py runserver
```

Open your browser and navigate to `http://127.0.0.1:8000/`:

![Homepage with a search bar to enter a location](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/0f4c76f7-78a0-4f7b-0d70-e2bf8dbd3800/lg2x)

Enter a location of your choice into the search bar and click "Search". You’ll be taken to a new page where you can select the specific country or region associated with that city.

![List of possible countries or regions matching the entered location](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bab4b3bb-3365-4d2a-45ed-382c4bfb6000/lg2x)

Once selected, the weather information for that location will be displayed:

![Weather details page showing temperature, forecast, and other weather metrics](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1e073cd2-a6e8-437b-6ddb-82888e9adc00/lg2x)

## Breaking down the sample application

For this tutorial, we will implement a basic logging system in a Django-powered
weather search application — Horus. This section will introduce the project
architecture, technologies used, and discuss some important points about the
project.

### Project structure

The `horus` directory follows the
[standard Django configuration](https://docs.djangoproject.com/en/4.0/intro/tutorial01/),
except for the hierarchy of the views. Instead of having a traditional large
`views.py` file, each view corresponds to a Python file in the `horus/views/`
folder to make logging easier to implement.

The critical files for this project are as follows:

```text
> horus/
    > views/
        * index.py      — houses the Index view
        * search.py     — houses the Search view
        * weather.py    — houses the Weather view
    * openweather.py    — OpenWeather API access wrapper
    * settings.py       — configurations for the various components of the project
* .env                  — environment variables for the project
* requirements.txt      — required packages for the project
```

### Core views

Each view corresponds to a page in Horus, and there are three in total:

1. Index: the homepage with a search input.
2. Search: displays the search results, allowing users to select the intended
   location.
3. Weather: displays the weather of the selected location.

To understand the basic construction of a page, open `horus/views/search.py` in
your text editor:

```python
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
```

The routing logic is as follows:

![Search page routing](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8df6a695-ac19-4019-39a6-42992f39e700/public =523x768)

The other pages also rely on their respective templates (found in
`horus/templates/`) to render the data accordingly. However, for this article,
it is not crucial to understand how templating works in Django. If you wish to
learn more, refer to the
[Django documentation on templates.](https://docs.djangoproject.com/en/4.0/topics/templates/).

Overall, the general program flow is as follows:

![Horus Program Flow](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/89652ac7-0205-4296-762b-d987145b3400/public =1116x675)

### The OpenWeatherMap API

Horus relies on the OpenWeatherMap API to provide up-to-date information about
the current weather at a location. It uses two endpoints from the API —
[geocoding](https://openweathermap.org/api/geocoding-api) to match the user
search query with possible locations and
[current weather](https://openweathermap.org/current) to retrieve the current
weather of the selected location.

A basic API wrapper has been built around the endpoints mentioned above and can
be found in `horus/openweather.py`. The built-in `requests` module is used to
query each endpoint with the given parameters and their responses are parsed
accordingly:

```python
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
```

Note that this wrapper utilizes error handling for response management. If a
request is successful, the wrapper function will return the parsed response from
the API. If unsuccessful, the wrapper will raise an error instead. It is up to
the developer to catch and handle the error accordingly (which we do).

Limitations-wise, we will use the free tier of the OpenWeatherMap API with
certain limits. In our case, however, we will not run into these limits.

### Design decisions

We have explicitly avoided using JavaScript or building a Single-Page
Application (SPA) to minimize complexity. We're also relying on the SQLite
database provided by Django as set up in the Prerequisites section.

To demonstrate multi-user access, each user will have a unique UUID assigned
when they first access the Horus homepage. We will explore the usefulness of
this approach when integrating Horus with a log aggregation system.

Now that you understand how the project works, let's revise the advanced logging
features in Python next.

## Recap of Python logging basics

In the [introductory piece on logging in
Python](https://betterstack.com/community/guides/logging/how-to-start-logging-with-python/), we briefly covered the basics of its
standard `logging` module. To recap, we touched base on Loggers, Formatters,
Handlers, and Filters, with an emphasis on the first three.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XSwIUnGXrwY?si=GHo3uL4GAJEYb_aI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Here's a brief recap of what they all do:

1. `Logger`: writes log records.
2. `Formatter`: specifies the structure of each log record.
3. `Handler`: determines the destination for each records.
4. `Filter`: determines which log records get sent to the configured
   destination.

These components follow the general setup process:

![Advanced Logging Setup](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/56d4e506-a2e0-4df0-4814-cccddc20ab00/public =211x681)

Now that we have a general idea of how logging works in Python, we will begin to
implement these concepts in Horus.

## Creating a Django-independent logging system

In this section, we will explore how to create a basic logging infrastructure
that doesn't rely on Django-specific features, and we will use the flowchart
above to guide our implementation. Let's take a look at the `views/index.py`
file in the project directory for instructions on achieving this in code.

Throughout this tutorial, we will use
[Visual Studio Code](https://code.visualstudio.com/) as our default editor but
feel free to use any editor that you are comfortable with.

```command
code horus/views/index.py
```

When you first open the file in your editor, you will see that we've already set
up the general logging infrastructure that will be replicated elsewhere. Let us
go through the infrastructure one step at a time.

```python
[label horus/views/index.py]
. . .

logger = logging.getLogger('horus.views.index')

logger.setLevel(logging.INFO)

. . .
```

First, a new `Logger` is instantiated and named `horus.views.index`. This name
is included in every log entry produced by the `logger` so its good to give a
descriptive name to easily locate the origin of a record. The minimum log level
of the `logger` is set to `INFO` so that only messages logged at the `INFO`
level or above are recorded.

```python
[label horus/views/index.py]
. . .
formatter = logging.Formatter('%(name)s at %(asctime)s (%(levelname)s) :: %(message)s')
. . .
```

Next, a `Formatter` is created to specify the structure of each log message like
this:

```text
<name> at <timestamp> (<level>) :: <message>
```

There are many other
[formatting attributes](https://docs.python.org/3/library/logging.html#logrecord-attributes)
that can be used to format your logs so do check them out.

```python
[label horus/views/index.py]
[highlight]
sh = logging.StreamHandler()
sh.setFormatter(formatter)
[/highlight]
```

An instance of the `StreamHandler` class also created and used to direct all
logs to the standard error. On the next line, the `formatter` we created is set
on the `StreamHandler` instance so that the correct formatting is applied to
each record.

```python
[label horus/views/index.py]
[highlight]
logger.addHandler(sh)
[/highlight]
```

Lastly, the `StreamHandler` is added instance to our `logger` such that all logs
are created through it are sent to the console.

At this point, we have a basic infrastructure for logging to the console and we
can begin to log messages in our project. For example, let's log the unique UUID
that is assigned to each new request to the homepage.

```python
[label horus/views/index.py]
def index(request):
    request.session['id'] = str(uuid.uuid4())

[highlight]
    logger.info(f'New user with ID: {request.session["id"]}')
[/highlight]

    return render(request, 'index.html', {})
```

You can see it in action by starting the Django application with the following
command:

```command
python manage.py runserver
```

```text
[output]
Performing system checks...

System check identified no issues (0 silenced).
May 28, 2025 - 18:27:49
Django version 5.1.4, using settings 'horus.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

Head over to [http://localhost:8000](http://localhost:8000) in your browser and
observe the following log entry in the terminal:

```text
[output]
horus.views.index at 2025-05-28 18:27:59,042 (INFO) :: New user with ID: ce0f77e5-577c-4752-b259-b3e757de3b07
```

Normally, Django projects will have other logs printed to the console, but we
have disabled them in the `settings.py` project so that we can focus solely on
the logs generated by Horus itself.

Now that we have implemented a logging infrastructure that is independent of
Django-specific features, let's practice by repeating the same process in the
`openweather.py` file. Open the file, and follow the `TODO` prompts to set up
the necessary logging infrastructure (the solution is discussed below).

### Notes for practice: Django-independent logging

To create a `FileHandler`, refer to the
[documentation for the necessary configurations](https://docs.python.org/3/library/logging.handlers.html#logging.FileHandler)
(Hint: `fh = logging.FileHandler('logs.txt')`).

One of the prompts requires you to log the OpenWeather API key to the console.
This is a bad practice so once you have written up the code for this, ensure
that you remove it before moving on to the next section.

For the prompts about logging various information about the program state,
follow these general guidelines:

1. Be as specific as possible about the site of the log.
2. Use appropriate log levels that correspond to the respective severities of
   the events.
3. Include as much information about the log and problem, instead of just
   printing results.

Once you have completed the prompts, you can refer to the solution by changing
to the solution branch.

```command
git switch independent-solutions
```

Return to the `openweather.py` file in your editor and observe how each prompt
was addressed.

```python
[label horus/openweather.py]
logger = logging.getLogger('horus.openweather')
logger.setLevel(logging.INFO)
formatter = logging.Formatter(
    '%(name)s at %(asctime)s (%(levelname)s) :: %(message)s')
```

The initialization of the `Logger` and `Formatter` is the same as in the
`index.py` example except that the name of the `logger` is `horus.openweather`.

```python
[label horus/openweather.py]
sh = logging.StreamHandler()

[highlight]
fh = logging.FileHandler(filename='logging-logs.txt')
[/highlight]
```

The creation of the `StreamHandler` follows the same the same pattern as in the
`index.py` file. We also created an instance of the `FileHandler` class for
outputting our logs to a file. This handler requires a `filename` argument that
represents the name of the log file that is saved to the filesystem.

```python
[label horus/openweather.py]
fh.setLevel(logging.WARNING)
```

The next prompt specifies that only logs of `WARNING` level and above should to
be logged to the file, so the minimum log level of the newly created
`FileHandler` is set to `WARNING`.

```python
[label horus/openweather.py]
sh.setFormatter(formatter)
fh.setFormatter(formatter)

logger.addHandler(sh)
logger.addHandler(fh)
```

Afterward, the `formatter` is set on both the `StreamHandler` and `FileHandler`
instances, and both handlers are subsequently added to the `logger`.

The prompts about logging program state do not have fixed answers, but it is
advisable to follow the above guidelines. The two most important prompts in this
section are:

1. Bad example logging:

   Remember to delete the log after you have ensured that it works as it is bad
   practice to log tokens or API keys.

2. Logging when an API request fails:

   Use `logger.error()` instead of `logger.info()` as we are logging something
   that goes against the normal program flow. When we are logging on the server,
   it is important that any failed API requests are logged as errors, not as
   warnings, so that future debugging will be easier.

   ```python
   [label horus/openweather.py]
   # ...
   if not response.ok or len(response.json()) == 0:
   [highlight]
       logger.error(
           'search_countries failed as response returned not OK or no results in returned search')
   [/highlight]
   # ...
   ```

Once you are done inspecting the solutions branch, switch back to your `main`
branch with the command below:

```command
git checkout main
```

Now that we've set up a basic logging infrastructure independent of Django, we
can look how to construct a Django-based logging setup in our application. This
should be the preferred approach as it saves you from writing a lot of
boilerplate code.

[summary]
### Centralize your Django logs with Better Stack

As you learn Django logging throughout this tutorial, keep in mind that production applications need centralized log management. [Better Stack](https://betterstack.com/log-management) provides SQL queries, live tail, and automated anomaly detection to help you debug Django applications faster.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="Live tail" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Free tier includes 3GB of logs with 3-day retention—perfect for Django development.

[Start collecting logs free](https://betterstack.com/users/sign-up).
[/summary]

## Implementing a Django-specific logging system

Something you might have noticed about the Django-independent logging system
above is that setting up the logger, handler and formatter often has to be done
within the file that requires logging.

To address this, Python's `logging` module has a built-in system for
centralizing log configurations through the `logging.dictConfig()` function.
This function loads a
[dictionary of logger configurations](https://docs.python.org/3/library/logging.config.html#logging-config-dictschema)
as a "global" store of loggers. This centralizes the logging infrastructure and
avoids the problem of repeating the setup steps per file.

Django integrates with this built-in `dictConfig` system so that you can
centralize your logging configuration in the `settings.py` file. Let us begin by
looking at a basic example in `horus/settings.py`. It houses the logging
configurations under the `LOGGING` field towards the end of the file.

Before the `LOGGING` field in `settings.py`, the `LOGGING_CONFIG` field is set
to `None` to disable the automatic configuration process since we're going to
set up a custom configuration shortly.

```python
[label horus/settings.py]
LOGGING_CONFIG = None
```

Next, we configured the logging behaviour of the `requests` library by setting
it to only display logs equal to or above the `ERROR` log level.

```python
[label horus/settings.py]
logging.getLogger("requests").setLevel(logging.ERROR)
```

Lastly, the `LOGGING` field is used to setup the `dictConfig()` method:

```python
[label horus/settings.py]
logging.config.dictConfig(LOGGING)
```

These three steps effectively disable the default logging setup provided by
Django and allows our application logs to take center stage.

```python
[label horus/settings.py]
# ...
[highlight]
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
    },
    'handlers': {
    },
    'loggers': {
    }
}
[/highlight]
```

Let's now shift our focus to defining a basic logging setup in Django. We can
configure several loggers, formatters, and handlers in a single location and
then import them into our code as needed. The `disable_existing_loggers` key is
set to `False` so that our loggers from the previous section will still work,
but you may disable them if you want to restrict the use of loggers in your
Django application to only the ones defined in the `settings.py` file
(recommended).

Let's start by defining a new `Formatter`. Add the following code to the
`formatters` dictionary shown below:

```python
[label horus/settings.py]
. . .
'formatters': {
[highlight]
    'base': {
        'format': '{name} at {asctime} ({levelname}) :: {message}',
        'style': '{'
    }
[/highlight]
},
. . .
```

The new `Formatter` is called `base` and it uses the same log message format in
the previous section. Setting the `style` key to `{` ensures that we can
reference the log message attributes using curly braces.

Similarly, a new `Handler` is created by adding it to the `handlers` dictionary
within the `LOGGING` dictionary:

```python
[label horus/settings.py]
. . .
'handlers': {
[highlight]
    'console': {
        'class': 'logging.StreamHandler',
        'formatter': 'base'
    },
[/highlight]
},
. . .
```

The `console` handler is a `StreamHandler` instance that logs to the console,
and it uses the `base` Formatter created earlier to format its output.

Finally, let's define a new `Logger` under the `loggers` dictionary as follows:

```python
[label horus/settings.py]
. . .
'loggers': {
[highlight]
    'horus.views.search': {
        'handlers': ['console'],
        'level': 'INFO'
    }
[/highlight]
}
. . .
```

Our new logger is called `horus.views.search` and it uses the `console` handler
defined earlier. It is also configured to only record messages with a log level
of `INFO` and above.

With this configuration in place, we can access the `horus.views.search` logger
in any file like this:

```python
logger = logging.getLogger('horus.views.search')
```

Open the `views/search.py` file in your editor and observe how this logger was
imported and used in several places:

```python
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
```

When you search for a city in the application, you will observe that the
following logs are recorded to the console:

![successful search](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8d334003-c498-4faf-35a4-a7278e451200/public =1349x768)

```text
[output]
horus.views.search at 2025-05-28 18:34:00,184 (INFO) :: User b617a3b3-773b-42aa-b679-fc12e2370818 has navigated to /search
horus.views.search at 2025-05-28 18:34:00,184 (INFO) :: User b617a3b3-773b-42aa-b679-fc12e2370818 searched for london
```

If you try to make a GET request to the `/search` route, it will redirect you
back to the homepage and a `INFO` message will be logged to the console:

```text
horus.views.search at 2025-05-28 18:36:00,702 (INFO) :: Invalid access made to /search, redirecting to /
```

In the latter part of the function, `logger.error()` is used in the `except`
block so that if the search fails, an error is logged to the console. The
`exc_info` argument is used to provide contextual information about the
exception within the log message itself. We don't need to raise the exception
since it does not impede the overall operation of the application and it is
sufficiently handled in the `except` block by rendering an error page.

You can test it out by typing some gibberish in the search input instead of a
location:

![gibberish search text](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/335e0f2f-4f0b-4786-3c0b-00ac344bb800/public =1349x768)

Once you click the search button, you will notice that the search was not
successful:

![search failed](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/dfaa577b-09db-4020-d15f-08059fb5db00/public =1349x768)

And the following error will be logged to the console:

```text
[output]
horus.views.search at 2025-05-28 18:42:43,842 (ERROR) :: Unable to retrieve matching locations for search
Traceback (most recent call last):
  File "/home/user/horus/views/search.py", line 35, in search
    locations = search_countries(location)
  File "/home/user/horus/openweather.py", line 61, in search_countries
    raise OpenWeatherError(
horus.openweather.OpenWeatherError: OpenWeather could not find matching locations - response not OK or response is empty
```

Now that we have seen how a Django-specific logging configuration works in
practice, we can dive into some practice in both `horus/settings.py` and
`horus/views/weather.py`, following the prompts provided in both files.

### Notes for practice: Django-specific logging

First, head over to the `settings.py` file and complete the `TODOs` to create
and configure a new `Logger`. Afterward, use the newly created `Logger` in
`horus/views/weather.py`, following the given prompts to add logging to the
file.

Once you have completed the prompts, you can refer to the solution by changing
to the solution branch using the command below:

```python
git switch specific-solutions
```

Return to the `settings.py` file in your text editor:

```python
[label settings.py]
LOGGING = {
    # ...
    'handlers': {
        # ...
        'file': {
            'class': 'logging.FileHandler',
            'formatter': 'base',
[highlight]
            'level': 'WARNING',
            'filename': 'django-logs.txt'
[/highlight]
        }
    },
    # ...
}
```

In `settings.py`, a new `FileHandler` called `file` is added to the `handlers`
dictionary. Like the `FileHandler` from the previous section on
Django-independent logging, this `FileHandler` will have a minimum level of
`WARNING` and above. It also needs to have a `filename` value specified and it
uses the `base` formatter declared earlier.

```python
[label horus/settings.py]
LOGGING = {
    # ...
    'loggers': {
        # ...
        'horus.views.weather': {
            'handlers': ['console', 'file'],
            'level': 'INFO'
        }
    }
}
```

Secondly, the `horus.views.weather` logger is also created and it logs to both
the `console` and `file` handlers.

For the prompts in `views/weather.py`, follow the same guidelines as the ones
highlighted in the previous section. Because of Django's centralized logging
infrastructure, we can use `logging.getLogger()` to specify the name of the
`Logger` we'd like to use as long as it is defined in `settings.py`.

```python
[label horus/views/weather.py]
logger = logging.getLogger('horus.views.weather')
```

Once you have explored the suggested solution for this section, change back to
the `main` branch.

```command
git checkout main
```

We have just explored how Django-independent and Django-specific logging works
and the differences between them. Let us now look at log aggregation systems,
why they are necessary, and how to get started quickly with aggregating your
Django logs in the cloud

## Using Log Aggregation systems

Since production applications are often deployed to multiple servers, it is necessary to centralize the logs so that you don't have to log into each server to view them and also so they can be analyzed and monitored for problems automatically. There are many solutions for centralizing application logs but we will go with the simplest option here which is using a hosted cloud service. For this section, we have opted to use [Better Stack Telemetry](https://betterstack.com/telemetry) due to its simplicity in getting started.

If you're new to Better Stack or want to see how the complete integration workflow looks before diving in, here's a quick overview of connecting your application data:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/_V81nd6P1iI" title="What is Better Stack?" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>


### Setting up a Better Stack Telemetry account

First, log in to your [Better Stack Telemetry account](https://betterstack.com/telemetry). In the left menu, click on **Sources**, then hit the **Connect source** button:

![Better Stack Telemetry sources](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/3ddda122-aa6a-4a1a-6b84-ab5b02e02900/public =2760x644)

Next, give your source a name — for example, "Django application." Then, choose **Python code** as the platform and click **Create source**.

![Create Better Stack Telemetry source](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ddee5d7b-78f5-43cd-359d-f6145ed98700/lg1x =2403x3515)

Once the source is created, you will get a **source token** (for example, `qU73jvQjZrNFHimZo4miLdxF`) and an **ingestion host** (for example, `s1315908.eu-nbg-2.betterstackdata.com`). Copy both values as they're essential for configuring log forwarding:

![Screenshot of the Better Stack interface showing a created log source with the source token and ingestion host highlighted](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2b6e3ed3-1d5e-43b1-c785-2a4960eb2500/lg1x =2460x1344)

Add the source token and ingestion host to your `.env` file:

```text
[label .env]
...
LOGTAIL_SOURCE_TOKEN=<your_source_token>
LOGTAIL_INGESTING_HOST=<your_ingesting_host>
```

**Important:** Replace `<your_source_token>` and `<your_ingesting_host>` with your actual values from the Better Stack dashboard.

This step is incredibly important as without it, your project will not be able to integrate with Logtail.

Finally, create a new branch on the repository and call it `logtail`:

```command
git checkout -b logtail
```

We have now successfully configured a Logtail source so we will integrate it with our `Horus` application to ensure that all logs are sent to the service.

### Integrating Horus with Better Stack Telemetry

To get started, let us work within `views/index.py` by adding a Logtail handler:

```python
[label horus/views/index.py]
[highlight]
import environ
from logtail import LogtailHandler
[/highlight]

# ...

[highlight]
env = environ.Env()
env.read_env(env.str('ENV_PATH', '.env'))

lh = LogtailHandler(
    source_token=env('LOGTAIL_SOURCE_TOKEN'),
    host=f"https://{env('LOGTAIL_INGESTING_HOST')}"
)
lh.setFormatter(formatter)
logger.addHandler(lh)
[/highlight]
```

Notice that the general steps to set up Better Stack Telemetry in `views/index.py` is similar to the steps taken in previous sections. Now, we can kill the Horus server with `Ctrl-C` and start it up once again:

```command
python manage.py runserver
```

Visit the Horus homepage to generate a log record. Afterward, head over to the **Live tail** section on the Telemetry dashboard. Live tail provides real-time visibility into your application logs as they arrive. To see how it works, watch this quick demonstration:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/XJv7ON314k4" title="Live tail" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

![Screenshot of Live tail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/c4c54b83-196d-45e2-49f6-6baa09775a00/public =1638x606)

You should notice the log entries in the dashboard like this:

![Screenshot of Better Stack Telemetry live tail](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/88251b9c-f4ea-4932-7080-916877528e00/public =3024x1808)

Now that you have a general notion of how Better Stack Telemetry is integrated with Django-independent logging infrastructure, try modifying the other files to use `LogtailHandler` as well. Hint: You only need to modify `openweather.py` and `settings.py`.

For Django-specific logging, note that the `source_token` argument is set as a key in the corresponding handler in `settings.py`. Also remember to add the handler to the respective loggers. When properly configured, you will only need to add the `LogtailHandler` to the respective `Logger`s once in `horus/settings.py` and the centralized logging infrastructure will handle the rest accordingly.

To view the complete solutions, change to the solution branch:

```command
git switch logtail-solutions
```

```python
[label horus/openweather.py]
. . .

lh = LogtailHandler(
    source_token=env('LOGTAIL_SOURCE_TOKEN'),
    host=f"https://{env('LOGTAIL_INGESTING_HOST')}"
)
lh.setFormatter(formatter)
logger.addHandler(lh)
. . .
```

Setting up Logtail in the `openweather.py` file involves adding a `LogtailHandler` to the existing `Logger` as demonstrated above.

```python
[label horus/settings.py]
. . .
LOGGING = {
    # ...
    'handlers': {
        # ...
        'logtail': {
            'class': 'logtail.LogtailHandler',
            'formatter': 'base',
            "source_token": env("LOGTAIL_SOURCE_TOKEN"),
            "host": f"https://{env('LOGTAIL_INGESTING_HOST')}",
        },
        # ...
    },
    # ...
}
. . .
```

In `settings.py`, we need to add a `LogtailHandler` to our `handlers` dictionary, as we have done for both `StreamHandler` and `FileHandler`. This time, we specified the `source_token` key to be the `LOGTAIL_SOURCE_TOKEN` and `LOGTAIL_INGESTING_HOST` added to `.env` earlier.

Afterward, we can add this new `logtail` handler to any of the loggers as shown below:

```python
[label horus/settings.py]
LOGGING = {
    # ...
    'loggers': {
        'horus.views.search': {
[highlight]
            'handlers': ['console', 'logtail'],
[/highlight]
            'level': 'INFO'
        },
        'horus.views.weather': {
[highlight]
            'handlers': ['console', 'file', 'logtail'],
[/highlight]
            'level': 'INFO'
        }
    }
}
```

Once you successfully integrated Better Stack Telemetry in your application, you will observe the application logs in the **Live tail** section.

![Logtail Concurrent User Logs](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/5c408f80-d059-43a0-9c7f-610c8b8b9800/public =3024x1530)

### Demonstrating multi-user access and logging

To visualize how log aggregation systems enhance logging for concurrently accessed applications, we can simulate multi-user access using the following variations of browser tabs:

1. 1 incognito tab + 1 non-incognito tab of the same browser
2. 1 non-incognito tab from two separate browsers

Note that any other variation may cause Django to mix up the UUIDs assigned per tab, so use only the two variations provided above.

Access `http://localhost:8000` on each tab and you will find that the user sessions are maintained across each tab (simulating a unique user) and whenever an action is performed in a tab, it is properly attributed and logged under the corresponding user.

![Logtail Concurrent User Logs](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/da5a20bf-598b-40af-6aca-72ccc5e07000/public =1366x290)

From the logs above, we can understand that one user attempted to search for an invalid location while the other searched for "Singapore".

Notice how `exc_info` displayed the full exception caused by the invalid search, providing as much contextual information as possible about the problem for further diagnosis.

You can see that with a log aggregation system like Better Stack, all the logs are centralized and easily viewed, making problem diagnosis a lot easier. Beyond viewing individual log entries in real-time, you can also query your logs using SQL to analyze patterns, track error rates, or investigate specific issues. For example, you could query all error logs from the past hour or find slow database queries. Here's how SQL querying works in Better Stack:

<iframe width="100%" height="315" src="https://www.youtube.com/embed/kf97nwgL88M" title="Building charts with SQL" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

With SQL queries, you can extract deeper insights from your Django application logs, create custom dashboards to monitor key metrics, and set up automated alerts when specific patterns emerge.

## Final thoughts

While you can build your logging infrastructure from the ground up, it is often
best to consult the documentation of the library/framework you are using as they
usually provide built-in mechanisms to enhance the logging process.

In Django, it comes in the form of modifying a central `settings.py` file with
the relevant logging infrastructure and retrieving the relevant configuration
with `logging.getLogger()` in any program file.

I hope this article has provided sufficient details to help you get started with
logging in your Django application. If you are interested in learning more about
logging in Django, please refer to the
[official documentation](https://docs.djangoproject.com/en/4.0/topics/logging/). Additionally, for further resources on Django, check our step-by-step guide on [how to deploy Django apps with Docker](https://betterstack.com/community/guides/scaling-python/dockerize-django/).

_This article was contributed by guest author
[Woo Jia Hao](https://twitter.com/@woojiahao_), a Software Developer from
Singapore! He is an avid learner who loves solving and talking about complex and
interesting problems. Lately, he has been working with Go and Elixir!\_
