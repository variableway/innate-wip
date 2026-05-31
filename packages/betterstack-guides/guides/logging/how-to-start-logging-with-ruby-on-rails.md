# How to Start Logging With Ruby on Rails

Logging is an important part of every application life cycle. Having a good
logging system becomes a key feature that helps developers, sysadmins, and
support teams to understand and solve appearing problems.

Every log message has an associated log level. The log level helps you
understand the severity and urgency of the message. Usually, each log level has
an assigned integer representing the severity of the message.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/b7SWkjgcuMU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

As for Ruby on Rails, there are many useful built-in tools and external gem
packages to simplify the logging process, providing features such as specifying
different logging targets, logs tagging, logs auto-formatting, and many others.

In this tutorial, we are going to explore how to use the built-in Ruby logger
with Rails. Specifically you will learn how to:

- Create a CRUD Ruby on Rails application.
- Configure the logger in Ruby on Rails.
- Log data using the globally configured logger.
- View the logs via the console

## Prerequisites

You will need:

- Ruby installed.
- Rails installed.

[ad-logs]

## Step 1 — Creating a Project

To get started, you need to create a new project. Fortunately, Rails comes with
many scripts, usually called generators. These scripts are designed to simplify
your development process by creating necessary files and configs.

The first thing to do is to run the `rails new` command, where the first
argument is the application's name. For the tutorial, we are going to create an
application called `myapp`.

    $ rails new myapp

After the script execution is finished, you have to enter the application's
directory and run the `bundle install` command to install all dependencies.

    $ cd myapp
    $ bundle install

## Step 2 — Creating Model and Making Migrations

Ruby on Rails applications follow the
[MVC (Model-View-Controller)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
pattern. The pattern is designed to split the application's functions into 3
groups: models, views, and controllers. The models are used to represent data.
Also, they interact with the application's database using another Rails feature
— Active Record.

To create a model you can run another generator — `rails g model`. The command's
first argument is the model's name and the next are the model's fields with
their types.

For our application, we will create a model called Person with a string filed
`name` and an integer field `age`.

    $ rails g model person name age:integer

After the model's creation, you must make migrations to create the essential
tables in the database. The database-agnostic migrations are written in Ruby and
can be found in `db/migrate/<timestamp>_create_articles.rb`.

Rails provide a fast and simple way of making the migrations via
[the Rails CLI](https://guides.rubyonrails.org/command_line.html).

    $ rails db:migrate

You can get additional information about models and migrations
[in the documentation](https://guides.rubyonrails.org/getting_started.html#mvc-and-you-generating-a-model).

## Step 3 — Creating Controller

As an MVC framework, Rails must include the controller, which is a middleman
between the views and the models.

Rails' naming policy requires the controller name to be plural, so we have to
call the controller for the `person` model `people`.

To create a controller you can run another generator — `rails g controller`. The
command's first argument is the controller's name and the next are the
controllers methods. The default controller's methods are index, show, new,
create, edit, update, and destroy.

    $ rails g controller people index show new create edit update destroy

The advanced about controller is available
[in the documentation](https://guides.rubyonrails.org/v6.1/action_controller_overview.html).

## Step 4 — Configuring Routes

Every web application has its own routing system. As for Rails, it has a lot of
built-in tools to simplify the routing process for you.

In the example, we will use the stock resource routing for the
`PeopleController`.

    config/routes.rb
    Rails.application.routes.draw do
      resources :people
    end

You can find additional information about routing in Rails
[in the documentation](https://guides.rubyonrails.org/getting_started.html#mvc-and-you-generating-a-model).

## Step 5 — Configuring Controller

In Ruby on Rails, each controller is represented by a class inherits from
`ApplicationController`.  When the application receives a request, the router
will find an appropriate controller and call its methods.

The controllers files are located in `app/controllers/`. In the tutorial we have
only 1 controller — `PeopleController`, we are going to add simple CRUD logic to
it.

You can see the controller's code below.

    app/controllers/people_controller.rb
    class PeopleController < ApplicationController
      def index
        # create a variable with all persons from database
        @persons = Person.all
      end

      def show
        # select a person with the id
        @person = Person.find(params[:id])
      end

      def new
        # create a new person
        @person = Person.new
      end

      def edit
        # select a person with the id
        @person = Person.find(params[:id])
      end

      def create
        # create a person with the params
        person = Person.create(person_params)
        # redirect to the created person's view
        redirect_to people_path(@person)
      end

      def update
        # select a person with the id
        @person = Person.find(params[:id])
        # update the person using the params
        @person.update(person_params)
        # redirect to the updated person's view
        redirect_to people_path(@person)
      end

      def destroy
        # select a person with the id
        @person = Person.find(params[:id])
        # delete the person
        @person.destroy
        # redirect to the index view
        redirect_to people_path
      end

      # start of the declaration of the private methods
      private

      def person_params
        # get params from the request
        params.require(:person).permit(:name, :age)
      end
    end

## Step 6 — Creating Views

The default views for a resource in Ruby on Rails are index, show, new, and
edit. The views can be written with the use of different template engines, such
as ERB, HAML, or Slim.

In the tutorial, we are going to use the stock template engine — ERB. It allows
you to mix HTML and Ruby code to generate web pages using data from the
database.

You can read more about ERB
[in the documentation](https://docs.ruby-lang.org/en/master/ERB.html).

The index view will be represented by a list of all persons in the database. You
can see its code in the snippet below.

```
    views/index.html.erb
    <h1>Persons</h1>
    <ul>
        <% @persons.each do |person| %>
            <li><%= person.name %> (<%= person.age %>)</li>
        <% end %>
    </ul>
```

The show view will be represented by a paragraph with the person data. You can
see its code in the snippet below.

```
views/show.html.erb
<h1>Persons #<%= @person.id %></h1>
<p><%= @person.name %> (<%= @person.age %>)</p>
```

The new view will be represented by a simple form where you can fill the new
person's data. You can see its code in the snippet below.

    views/new.html.erb
    <h1>Persons#new</h1>
    <%= form_with model: @person do |form| %>
      <%= form.text_field :name, placeholder: "name" %>
      <%= form.number_field :age, placeholder: "age" %>
      <%= form.submit %>
    <% end %>

The edit view will be represented by a simple form where you can change the
selected person's data. You can see its code in the snippet below.

    views/edit.html.erb
    <h1>Persons#edit</h1>
    <%= form_with model: @person do |form| %>
      <%= form.text_field :name, placeholder: "name" %>
      <%= form.number_field :age, placeholder: "age" %>
      <%= form.submit %>
    <% end %>

## Step 6 — Configuring Logger

Ruby on Rails allows you to use different loggers such as the default `Logger`
class, the `ActiveSupport::Logger` class, or the `Log4r` one.

All of them use the same log levels system. The system consists of 6 levels:

- **Unknown** — used for reporting about events with unknown severity level.
- **Fatal** — used for reporting about errors that are forcing shutdown of the
  application.
- **Error** — used for logging serious problems occurred during execution of the
  program.
- **Warn**  — used for reporting non-critical unusual behaviour.
- **Info** — used for informative messages highlighting the progress of the
  application for sysadmin and end user.
- **Debug** — used for debugging messages with extended information about
  application processing.

The default Rails log level is info in production mode and debug in development
and test modes.

For the application, we are going to use the default `Logger` class. The logger
will have a `log/all.log` file as the logging target and `info` as the minimum
log level.

    config/application.rb
    require_relative "boot"

    require "rails/all"

    # Require the gems listed in Gemfile, including any gems
    # you've limited to :test, :development, or :production.
    Bundler.require(*Rails.groups)

    module Myapp
      class Application < Rails::Application
        # Initialize configuration defaults for originally generated Rails version.
        config.load_defaults 6.1

        # create a logger with a file as a logging target
        config.logger = Logger.new('log/important.log')
        # set the minimum log level
        config.log_level = :warn

      end
    end

## Step 7 — Logging Setup

After the logger is configured, it can be globally accessed via the
`Rails.logger`.

For demonstration purposes, we are going to log each access to the views.

    app/controllers/people_controller.rb
    class PeopleController < ApplicationController
      def index
        # create a variable with all persons from database
        @persons = Person.all
        # logging
        Rails.logger.info 'Index view accessed'
      end

      def show
        # select a person with the id
        @person = Person.find(params[:id])
        # logging
        Rails.logger.info 'Show view of persons #' + params[:id] + ' accessed'
      end

      def new
        # create a new person
        @person = Person.new
        # logging
        Rails.logger.info 'New view accessed'
      end

      def edit
        # select a person with the id
        @person = Person.find(params[:id])
        # logging
        Rails.logger.info 'Edit view of persons #' + params[:id] + ' accessed'
      end

      def create
        # create a person with the params
        person = Person.create(person_params)
        # redirect to the created person's view
        redirect_to people_path(@person)
      end

      def update
        # select a person with the id
        @person = Person.find(params[:id])
        # update the person using the params
        @person.update(person_params)
        # logging
        Rails.logger.warn 'Person #' + params[:id] + ' has changed to '\\
                          + person_params[:name] + '(' +  person_params[:age]  + ')'
        # redirect to the updated person's view
        redirect_to people_path(@person)
      end

      def destroy
        # select a person with the id
        @person = Person.find(params[:id])
        # delete the person
        @person.destroy
        # redirect to the index view
        redirect_to people_path
      end

      # start of the declaration of the private methods
      private

      def person_params
        # get params from the request
        params.require(:person).permit(:name, :age)
      end
    end

## Step 8 — Testing

To verify that the created logging system works properly, we will imitate some
user's actions.

So, let's start the server with the following command:

    $ rails s

The first thing we are going to do is accessing the `localhost:3000/people/new`
via your favorite browser. On the page, you can create a new person via a simple
form. After you click the submit button, you will be redirected to the person's
page.

We will create a person named James Gold with an age equal to 33.

The second thing we are going to do is accessing the `localhost:3000/people` via
your favorite browser. On the page, you can see a list of all people in the
database.

The third thing we are going to do is accessing the
`localhost:3000/people/1/edit` via your favorite browser. On the page, you can
edit the person's data via a simple form. After you click the submit button, you
will be redirected to the person's page.

We will change the first person to James Silver 35.

Now, let's check the logs in log/logs.log. The file's contents must be similar
to that:

    Output
    I, [2021-05-21T02:45:02.709355 #11001]  INFO -- : Started GET "/people/new" for 127.0.0.1 at 2021-05-21 02:45:02 +0200
    I, [2021-05-21T02:45:02.710397 #11001]  INFO -- : Processing by PeopleController#new as HTML
    I, [2021-05-21T02:45:02.710990 #11001]  INFO -- : New view accessed
    I, [2021-05-21T02:45:02.712284 #11001]  INFO -- :   Rendered people/new.html.erb within layouts/application (Duration: 0.9ms | Allocations: 401)
    [Webpacker] Everything's up-to-date. Nothing to do
    I, [2021-05-21T02:45:02.724601 #11001]  INFO -- :   Rendered layout layouts/application.html.erb (Duration: 10.2ms | Allocations: 3820)
    I, [2021-05-21T02:45:02.725191 #11001]  INFO -- : Completed 200 OK in 15ms (Views: 13.7ms | ActiveRecord: 0.0ms | Allocations: 4228)

    I, [2021-05-21T02:45:19.241471 #11001]  INFO -- : Started POST "/people" for 127.0.0.1 at 2021-05-21 02:45:19 +0200
    I, [2021-05-21T02:45:19.243569 #11001]  INFO -- : Processing by PeopleController#create as HTML
    I, [2021-05-21T02:45:19.243654 #11001]  INFO -- :   Parameters: {"authenticity_token"=>"[FILTERED]", "person"=>{"name"=>"James Gold", "age"=>"33"}, "commit"=>"Create Person"}
    I, [2021-05-21T02:45:19.260693 #11001]  INFO -- : Redirected to <http://localhost:3000/people>
    I, [2021-05-21T02:45:19.270370 #11001]  INFO -- : Completed 302 Found in 25ms (ActiveRecord: 6.6ms | Allocations: 2809)

    I, [2021-05-21T02:45:19.449375 #11001]  INFO -- : Started GET "/people" for 127.0.0.1 at 2021-05-21 02:45:19 +0200
    I, [2021-05-21T02:45:19.453255 #11001]  INFO -- : Processing by PeopleController#index as HTML
    I, [2021-05-21T02:45:19.455647 #11001]  INFO -- : Index view accessed
    I, [2021-05-21T02:45:19.460140 #11001]  INFO -- :   Rendered people/index.html.erb within layouts/application (Duration: 2.1ms | Allocations: 316)
    [Webpacker] Everything's up-to-date. Nothing to do
    I, [2021-05-21T02:45:19.476031 #11001]  INFO -- :   Rendered layout layouts/application.html.erb (Duration: 18.1ms | Allocations: 3737)
    I, [2021-05-21T02:45:19.476481 #11001]  INFO -- : Completed 200 OK in 23ms (Views: 18.9ms | ActiveRecord: 0.2ms | Allocations: 4136)

    I, [2021-05-21T02:45:35.032957 #11001]  INFO -- : Started GET "/people/1/edit" for 127.0.0.1 at 2021-05-21 02:45:35 +0200
    I, [2021-05-21T02:45:35.034313 #11001]  INFO -- : Processing by PeopleController#edit as HTML
    I, [2021-05-21T02:45:35.034393 #11001]  INFO -- :   Parameters: {"id"=>"1"}
    I, [2021-05-21T02:45:35.119523 #11001]  INFO -- : Edit view of persons #1 accessed
    I, [2021-05-21T02:45:35.131464 #11001]  INFO -- :   Rendered people/edit.html.erb within layouts/application (Duration: 9.6ms | Allocations: 617)
    [Webpacker] Everything's up-to-date. Nothing to do
    I, [2021-05-21T02:45:35.139376 #11001]  INFO -- :   Rendered layout layouts/application.html.erb (Duration: 18.0ms | Allocations: 3978)
    I, [2021-05-21T02:45:35.140723 #11001]  INFO -- : Completed 200 OK in 105ms (Views: 18.8ms | ActiveRecord: 0.3ms | Allocations: 8302)

    I, [2021-05-21T02:45:45.536621 #11001]  INFO -- : Started PATCH "/people/1" for 127.0.0.1 at 2021-05-21 02:45:45 +0200
    I, [2021-05-21T02:45:45.538600 #11001]  INFO -- : Processing by PeopleController#update as HTML
    I, [2021-05-21T02:45:45.538705 #11001]  INFO -- :   Parameters: {"authenticity_token"=>"[FILTERED]", "person"=>{"name"=>"James Silver", "age"=>"35"}, "commit"=>"Update Person", "id"=>"1"}
    W, [2021-05-21T02:45:45.543507 #11001]  WARN -- : Person #1 has changed to James Silver(35)
    I, [2021-05-21T02:45:45.545317 #11001]  INFO -- : Redirected to <http://localhost:3000/people.1>
    I, [2021-05-21T02:45:45.546391 #11001]  INFO -- : Completed 302 Found in 8ms (ActiveRecord: 0.1ms | Allocations: 760)

    I, [2021-05-21T02:45:45.597733 #11001]  INFO -- : Started GET "/people.1" for 127.0.0.1 at 2021-05-21 02:45:45 +0200
    I, [2021-05-21T02:45:45.599988 #11001]  INFO -- : Processing by PeopleController#index as */*
    I, [2021-05-21T02:45:45.601509 #11001]  INFO -- : Index view accessed
    I, [2021-05-21T02:45:45.605313 #11001]  INFO -- :   Rendered people/index.html.erb within layouts/application (Duration: 1.9ms | Allocations: 317)
    [Webpacker] Everything's up-to-date. Nothing to do
    I, [2021-05-21T02:45:45.612336 #11001]  INFO -- :   Rendered layout layouts/application.html.erb (Duration: 8.9ms | Allocations: 3735)
    I, [2021-05-21T02:45:45.612635 #11001]  INFO -- : Completed 200 OK in 12ms (Views: 9.7ms | ActiveRecord: 0.4ms | Allocations: 4135)

## Conclusion

Logging in Ruby on Rails might seem hard, but it provides a lot of configuration
abilities, such as logs auto-formatting, logs tagging, support of structured
output, specifying logging targets, and many other useful features.

By following this tutorial, you have created a Ruby on Rails CRUD application,
learned how to configure the logger, and how to view the logs.

If you wish to continue learning about logging in Ruby on Rails, you may be
interested in [the best ruby logging libraries](https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/) or using multiple loggers for one application. It can be achieved by
[using tagged logging](https://api.rubyonrails.org/classes/ActiveSupport/TaggedLogging.html)
or specific gems, such as
[MultiLogger](https://github.com/lulalala/multi_logger).
