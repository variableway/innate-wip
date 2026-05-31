# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/
# Original language: ruby
# Normalized: ruby
# Block index: 12

logger.formatter = proc do |severity, datetime, _progname, msg|
  datefmt = datetime.strftime('%Y-%m-%dT%H:%M:%S.%6N')
  "timestamp=#{datefmt} level=#{severity.ljust(5)} msg='#{msg}'\n"
end