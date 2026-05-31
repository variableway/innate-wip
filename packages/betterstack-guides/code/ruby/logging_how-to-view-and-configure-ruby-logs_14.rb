# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/
# Original language: ruby
# Normalized: ruby
# Block index: 14

[highlight]
git_commit_hash = `git rev-parse HEAD`.strip
[/highlight]

logger.formatter = proc do |severity, datetime, _progname, msg|
  datefmt = datetime.strftime('%Y-%m-%dT%H:%M:%S.%6N')
  [highlight]
  "timestamp=#{datefmt} level=#{severity.ljust(5)} git_commit_hash=#{git_commit_hash} pid=#{Process.pid} msg='#{msg}'\n"
  [/highlight]
end