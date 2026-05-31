# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: ruby
# Normalized: ruby
# Block index: 28

[label app/jobs/welcome_email_job.rb]
class WelcomeEmailJob < ApplicationJob
  queue_as :default
  
  def perform(user)
    UserMailer.welcome_email(user).deliver_now
    Rails.logger.info "Welcome email sent to #{user.email}"
  rescue => e
    Rails.logger.error "Failed to send welcome email to #{user.email}: #{e.message}"
    raise e # Re-raise to trigger retry mechanism
  end
end