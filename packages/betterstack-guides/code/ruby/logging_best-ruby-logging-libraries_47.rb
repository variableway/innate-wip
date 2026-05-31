# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 47

logger = Yell.new do |l|
  l.adapter($stdout, level: %i[debug info warn])
  l.adapter($stderr, level: %i[error fatal])
end