# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 49

logger = Yell.new do |l|
  l.adapter($stdout, level: %i[debug info warn], format: '{"time": "%d", "msg": "%m", "level": "%L", "pid": %p}')
end