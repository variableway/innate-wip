# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 11

class UserContract < Dry::Validation::Contract
  params do
    required(:email).filled(:string)
    required(:username).filled(:string)
  end
  
  rule(:email) do
    unless URI::MailTo::EMAIL_REGEXP.match?(value)
      key.failure('must be a valid email')
    end
  end
end

class UserRepository < ROM::Repository[:users]
  def create_user(attributes)
    validation = UserContract.new.call(attributes)
    return validation unless validation.success?
    
    normalized = validation.output.merge(
      email: validation.output[:email].downcase.strip
    )
    create(normalized)
  end
end

result = user_repo.create_user(email: 'INVALID', username: 'ab')
result.errors.to_h if result.failure?