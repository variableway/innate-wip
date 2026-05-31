# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 37

[label config/application.rb]
require_relative "boot"

require "rails/all"

[highlight]
require "semantic_logger"
[/highlight]

Bundler.require(*Rails.groups)

module Myapp
  class Application < Rails::Application
[highlight]
    config.logger = SemanticLogger["Rails"]
    SemanticLogger.add_appender(io: $stdout, formatter: :color)
[/highlight]
  end
end