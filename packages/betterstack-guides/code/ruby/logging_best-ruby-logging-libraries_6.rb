# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 6

logger.formatter = proc do |severity, datetime, progname, msg|
  datefmt = datetime.strftime('%Y-%m-%dT%H:%M:%S.%6N')
  {
    timestamp: datefmt,
    level: severity.ljust(5),
    pid: Process.pid,
    msg: msg
  }.to_json + "\n"
end