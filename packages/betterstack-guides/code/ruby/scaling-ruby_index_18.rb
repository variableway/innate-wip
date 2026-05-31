# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 18

# Test validation contracts without database
RSpec.describe UserContract do
  it 'validates email presence' do
    result = UserContract.new.call(email: '', username: 'johndoe')
    expect(result).not_to be_success
  end
end

# Test domain entities without database
RSpec.describe Entities::User do
  it 'formats full name' do
    user = Entities::User.new(first_name: 'John', last_name: 'Doe')
    expect(user.full_name).to eq('John Doe')
  end
end

# Test repositories with database (integration tests)
RSpec.describe UserRepository do
  it 'creates user' do
    user = repo.create(email: 'user@example.com')
    expect(user.id).not_to be_nil
  end
end