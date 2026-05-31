# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/
# Original language: ruby
# Normalized: ruby
# Block index: 16

require 'logger'
require 'json'

. . .

git_commit_hash = `git rev-parse HEAD`.strip

logger.formatter = proc do |severity, datetime, _progname, msg|
  datefmt = datetime.strftime('%Y-%m-%dT%H:%M:%S.%6N')
  {
    timestamp: datefmt,
    level: severity.ljust(5),
    git_commit_hash: git_commit_hash,
    pid: Process.pid,
    msg: msg
  }.to_json + "\n"
end