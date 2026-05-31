# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: ruby
# Normalized: ruby
# Block index: 31

# app/jobs/cleanup_job.rb
class CleanupJob < ApplicationJob
  def perform
    # Remove unconfirmed users after 30 days
    User.where('created_at < ? AND confirmed_at IS NULL', 30.days.ago)
        .destroy_all
        
    # Clean up old log files
    Dir.glob(Rails.root.join('log', '*.log.*')).each do |file|
      File.delete(file) if File.mtime(file) < 7.days.ago
    end
  end
end

# config/schedule.rb (using whenever gem)
every 1.day, at: '2:00 am' do
  runner "CleanupJob.perform_later"
end