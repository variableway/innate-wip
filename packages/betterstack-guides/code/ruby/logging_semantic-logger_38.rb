# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 38

class ApplicationController < ActionController::Base
  def hello
[highlight]
    logger.info("Info message")
[/highlight]
    render html: "hello, world!"
  end
end