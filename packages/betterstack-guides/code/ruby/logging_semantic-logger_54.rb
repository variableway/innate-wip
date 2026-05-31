# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 54

[label config/application.rb]
module Myapp
  class Application < Rails::Application
    . . .
    [highlight]
    config.log_tags = {
      request_id: :request_id
    }
    [/highlight]
  end
end