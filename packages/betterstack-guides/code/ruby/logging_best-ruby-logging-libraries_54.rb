# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 54

logger = MrLogaLoga::Logger.new($stdout, formatter: MrLogaLoga::Formatters::Json.new)