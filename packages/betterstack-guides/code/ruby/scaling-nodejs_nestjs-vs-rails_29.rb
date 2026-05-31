# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: ruby
# Normalized: ruby
# Block index: 29

[label app/jobs/newsletter_job.rb]
class NewsletterJob < ApplicationJob
  queue_as :newsletters
  
  def perform(newsletter_id)
    newsletter = Newsletter.find(newsletter_id)
    newsletter.subscribers.find_each do |user|
      UserMailer.newsletter(user, newsletter).deliver_now
    end
  end
end