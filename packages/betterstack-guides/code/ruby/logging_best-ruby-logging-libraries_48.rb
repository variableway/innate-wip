# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 48

logger = Yell.new do |l|
  l.adapter(:file, 'app.log', level: %i[debug info warn]) # produces app.log
  l.adapter(:datefile, 'error.log', level: 'gte.error') # produces error.20230830.log
end