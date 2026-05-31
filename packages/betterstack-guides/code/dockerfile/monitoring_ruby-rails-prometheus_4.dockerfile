# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 4

[label Dockerfile]
FROM ruby:3.2

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

CMD ["rails", "server", "-b", "0.0.0.0"]