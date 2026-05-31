# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 4

logger.formatter = proc do |severity, datetime, progname, msg|
  datefmt = datetime.strftime('%Y-%m-%dT%H:%M:%S.%6N')
  "time=#{datefmt} level=#{severity.ljust(5)} pid=#{Process.pid} msg='#{msg}'\n"
end