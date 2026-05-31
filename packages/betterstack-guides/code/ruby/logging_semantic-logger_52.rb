# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 52

[label config/application.rb]
. . .

module Myapp
  class Application < Rails::Application
[highlight]
    config.semantic_logger.add_appender(io: $stdout, formatter: :json)
    config.rails_semantic_logger.format = :json
[/highlight]
  end
end