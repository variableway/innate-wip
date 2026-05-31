# ActiveRecord vs ROM

Ruby developers building database-backed applications typically start with ActiveRecord, Rails' battle-tested ORM that ships with the framework. ROM (Ruby Object Mapper) takes a fundamentally different approach, separating data access from business logic through functional programming principles and explicit boundaries.

This comparison examines how each library handles database operations, domain modeling, and application architecture to help you evaluate whether ROM's architectural patterns justify departing from ActiveRecord's familiar conventions.

## What is ActiveRecord?

![Screenshot of Ruby on Rails Github page](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1c5a26d8-065c-40a4-d246-4ab8c4745c00/md1x =800x400)

[ActiveRecord](https://guides.rubyonrails.org/active_record_basics.html) implements the Active Record pattern where domain objects contain both data and behavior. It treats database tables as classes and rows as objects, letting you manipulate data through Ruby methods without writing SQL.

The library assumes your database schema drives your object model. A `users` table automatically maps to a `User` class with methods for each column. This tight coupling between database and domain objects simplifies CRUD operations but makes testing and refactoring more complex as applications grow.

ActiveRecord ships with Rails but works independently. The framework integration means you get migrations, validations, and associations with minimal configuration. This "convention over configuration" philosophy trades flexibility for development speed.

## What is ROM?

![Screenshot of ROM](https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b690eb60-9bb2-4913-91a6-1cf7efb94200/public =1200x600)

[ROM](https://rom-rb.org/) separates data access from domain logic through distinct layers: relations for querying, repositories for data access patterns, and structs or custom objects for domain models. Created by Piotr Solnica in 2014, ROM applies functional programming principles to database interactions.

The library assumes your domain model shouldn't depend on database structure. You define how data maps between the database and your application explicitly, allowing domain objects to evolve independently of schema changes. This separation adds initial complexity but improves maintainability in larger applications.

ROM works with any Ruby application or framework. The adapters support SQL databases, NoSQL stores, and HTTP APIs using consistent interfaces. This flexibility makes ROM suitable for applications with multiple data sources or complex domain models that don't fit ActiveRecord's patterns.

## Quick Comparison

| Feature | ActiveRecord | ROM |
|---------|--------------|-----|
| **Architecture** | Active Record pattern | Data Mapper pattern |
| **Coupling** | Database schema drives models | Domain models independent of schema |
| **Design Philosophy** | Convention over configuration | Explicit mapping and composition |
| **Primary Use Case** | CRUD web applications | Complex domains with business logic |
| **Learning Curve** | Gentle (Rails standard) | Steep (functional concepts) |
| **Query Interface** | Model methods and scopes | Relation objects and repositories |
| **Persistence** | Models save themselves | Repositories handle persistence |
| **Testing** | Database required for most tests | Domain objects test without database |
| **Framework Integration** | Rails (tight coupling) | Framework-agnostic |
| **Boilerplate** | Minimal | Moderate to high |
| **Ecosystem** | Extensive Rails gems | Smaller, focused libraries |

## Installation and setup

ActiveRecord comes bundled with Rails:

```command
rails new myapp --database=postgresql
```

For standalone use outside Rails:

```ruby
require 'active_record'

ActiveRecord::Base.establish_connection(
  adapter: 'postgresql',
  database: 'myapp_development'
)

class User < ActiveRecord::Base
end

user = User.create(email: 'user@example.com')
```

The global connection means every model automatically connects to the database. Rails applications configure this through `config/database.yml`, where you specify adapter, host, database name, and credentials. The connection establishes once when your application starts, and all models share this connection pool.

For standalone applications, you call `establish_connection` directly before defining models. This creates a connection pool that ActiveRecord manages internally, handling connection acquisition and release as needed.

ROM requires explicit setup with multiple components:

```command
gem install rom rom-sql
```

Configure ROM by defining containers, relations, and repositories:

```ruby
require 'rom'

config = ROM::Configuration.new(:sql, 'postgresql://localhost/myapp')

class Users < ROM::Relation[:sql]
  schema(:users, infer: true)
end

class UserRepository < ROM::Repository[:users]
  commands :create
end

container = ROM.container(config)
user_repo = UserRepository.new(container)
user = user_repo.create(email: 'user@example.com')
```

The setup requires understanding ROM's component model. Relations define queries, repositories combine relations into data access patterns, and the container manages dependencies between components. You register relations with the configuration, then finalize it into a container that initializes all components.

This explicit structure provides clear boundaries between database access and domain logic. The container acts as a dependency injection container, making it easy to swap implementations for testing or connect to multiple databases. The initial complexity pays off as your application grows and needs more sophisticated data access patterns.

## Defining models and domain objects

ActiveRecord models inherit from `ActiveRecord::Base`:

```ruby
class User < ActiveRecord::Base
  validates :email, presence: true, uniqueness: true
  has_many :posts
  
  def full_name
    "#{first_name} #{last_name}"
  end
end

user = User.create(email: 'user@example.com', username: 'johndoe')
user.email = 'newemail@example.com'
user.save
```

The model handles validation, persistence, associations, and business logic in one place. ActiveRecord infers the table name from the class name following Rails conventions - a `User` class maps to a `users` table. Column attributes become accessible through getter and setter methods automatically generated from the database schema.

This approach feels natural for typical web applications. You create objects, modify their attributes, and save them back to the database. The model knows how to persist itself, which methods to call for validation, and what associations to load. Everything happens through the model instance without additional coordination.

The tight coupling between database and domain objects simplifies development initially but creates challenges as complexity grows. Testing business logic requires database connections, and changing the database schema often means updating multiple parts of your application.

ROM separates these concerns into distinct layers:

```ruby
# Relation: defines database queries
class Users < ROM::Relation[:sql]
  schema(:users, infer: true) do
    associations do
      has_many :posts
    end
  end
end

# Repository: handles data access
class UserRepository < ROM::Repository[:users]
  commands :create
  struct_namespace Entities
  
  def find_by_email(email)
    users.where(email: email).one
  end
end

# Domain entity: pure Ruby object
module Entities
  class User < ROM::Struct
    def full_name
      "#{first_name} #{last_name}"
    end
  end
end

# Validation: separate from persistence
class UserValidator < Dry::Validation::Contract
  params do
    required(:email).filled(:string)
    required(:username).filled(:string)
  end
end

# Usage separates concerns
user_repo = UserRepository.new(container)
result = user_repo.create(email: 'user@example.com', username: 'johndoe')
```

ROM's separation means more code upfront but clearer boundaries. The relation layer handles database queries and schema definitions. Repositories provide application-specific data access methods, combining relation queries into useful patterns. Domain entities remain plain Ruby objects without database knowledge.

This architecture makes each component testable in isolation. You can test domain logic without touching the database, test validations independently, and test repositories with real database connections. The explicit boundaries prevent business logic from leaking into persistence code and vice versa.

The tradeoff is increased boilerplate and a steeper learning curve. You need to understand how relations, repositories, and entities interact. For simple applications, this separation might feel like overengineering. For complex domains, the clear boundaries improve long-term maintainability.

## Writing queries

ActiveRecord generates queries through model methods:

```ruby
User.where(active: true)
User.where('created_at > ?', 1.week.ago).order(created_at: :desc)

# Scopes for reusable queries
class User < ActiveRecord::Base
  scope :active, -> { where(active: true) }
  scope :recent, -> { where('created_at > ?', 1.week.ago) }
end

User.active.recent
```

The query interface builds on the model class itself. You chain methods like `where`, `order`, and `limit` directly on the model, creating relation objects that execute lazily. The SQL only runs when you access results through methods like `each`, `to_a`, or `count`.

Scopes encapsulate common query patterns, making them reusable across your application. A scope is just a class method that returns a relation, allowing you to chain it with other scopes or query methods. This keeps query logic organized within the model.

The approach feels intuitive for developers familiar with object-oriented patterns. You ask the model for data, and it returns objects of the same type. The abstraction hides SQL details, letting you think in terms of Ruby methods rather than database queries.

However, complex queries can become difficult to read when multiple scopes and conditions chain together. The implicit SQL generation sometimes produces suboptimal queries, and debugging requires calling `.to_sql` to see what actually executes.

ROM defines queries in relation classes:

```ruby
class Users < ROM::Relation[:sql]
  schema(:users, infer: true)
  
  def active
    where(active: true)
  end
  
  def recent
    where { created_at > Time.now - 7*24*60*60 }
  end
end

class UserRepository < ROM::Repository[:users]
  def active_recent_users
    users.active.recent.to_a
  end
end

user_repo = UserRepository.new(container)
users = user_repo.active_recent_users
```

Relations define reusable query fragments. Repositories combine these fragments into data access patterns. Each query method in the relation returns another relation, allowing composition similar to ActiveRecord scopes. The difference is that queries live in a dedicated relation class rather than mixed with domain logic.

Repositories provide named methods for specific data access needs. Instead of chaining queries in controllers or service objects, you define repository methods that encapsulate common access patterns. This keeps query logic centralized and gives you explicit control over what queries your application performs.

The separation between relations and repositories creates clear layers. Relations handle low-level query construction, while repositories handle application-specific data retrieval. This makes query logic easier to find and test compared to queries scattered throughout your codebase.

The downside is more boilerplate. Simple queries that would be one-liners in ActiveRecord require defining methods in both relation and repository classes. For applications with straightforward data access needs, this structure adds unnecessary complexity.

## Handling associations and relationships

ActiveRecord declares associations in models:

```ruby
class User < ActiveRecord::Base
  has_many :posts
  has_many :comments
end

class Post < ActiveRecord::Base
  belongs_to :user
  has_many :comments
end

# Access through methods
user = User.find(1)
user.posts.each { |post| puts post.title }

# Eager loading to avoid N+1
users = User.includes(:posts)
users.each { |u| puts u.posts.count }
```

Association declarations create methods on your model instances. Calling `user.posts` triggers a query to load posts for that user. This lazy loading approach executes queries only when you access the association, which can lead to N+1 problems if you're not careful.

The N+1 problem occurs when iterating over a collection and accessing associations on each item. Loading 100 users then accessing `user.posts` for each one executes 101 queries - one for users and one per user for posts. ActiveRecord solves this with eager loading through `includes`, which loads associations upfront with a second query.

The association methods feel natural and keep relationship logic close to the models. You declare relationships once, and ActiveRecord generates all the necessary methods for navigation. The abstraction makes working with related data straightforward, though it can hide performance issues until they manifest in production.

ROM handles associations through explicit loading strategies:

```ruby
class Users < ROM::Relation[:sql]
  schema(:users, infer: true) do
    associations do
      has_many :posts
    end
  end
end

class UserRepository < ROM::Repository[:users]
  def find_with_posts(id)
    users.combine(:posts).by_pk(id).one!
  end
  
  def all_with_posts
    users.combine(:posts).to_a
  end
end

user_repo = UserRepository.new(container)
user = user_repo.find_with_posts(1)
user.posts.each { |post| puts post.title }
```

ROM requires explicit loading declarations, preventing N+1 queries by making loading strategies visible. You use `combine` to specify which associations to load, and ROM executes the necessary joins or separate queries to fetch related data efficiently.

The repository methods make data loading strategies explicit. When you call `find_with_posts`, you know exactly what data loads and what queries execute. This visibility helps prevent performance issues and makes it clear what each data access method does.

The entities ROM returns are plain structs without database connections. Once loaded, accessing associations doesn't trigger additional queries - the data is already present. This predictability makes performance characteristics clearer but requires thinking ahead about what data you need.

The tradeoff is less convenience. You can't lazily load associations after retrieving an entity. If you need additional data, you must return to the repository and load it explicitly. This forces deliberate thinking about data access patterns, which improves performance but requires more upfront planning.

## Validations and business rules

ActiveRecord includes validations in models:

```ruby
class User < ActiveRecord::Base
  validates :email, presence: true, uniqueness: true
  validates :username, presence: true, length: { minimum: 3 }
  
  before_save :normalize_email
  
  private
  
  def normalize_email
    self.email = email.downcase.strip if email.present?
  end
end

user = User.new(email: 'INVALID')
user.save  # => false
user.errors.full_messages
```

Validations run automatically before saving. The `validates` DSL provides common rules like presence, uniqueness, format matching, and length constraints. Callbacks like `before_save` execute at specific points in the object lifecycle, handling data normalization and derived values.

The integration feels seamless. You define rules in your model, and ActiveRecord enforces them whenever you save. However, coupling validations to models creates testing challenges - uniqueness validations require database connections, and complex business rules mixed with persistence logic make models grow large.

ROM separates validation from persistence using dry-validation:

```ruby
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
```

Validation contracts test without database connections. Contracts define valid input and validation rules independently of persistence. The repository integrates validation by calling contracts before persistence, returning result objects indicating success or failure. Data normalization happens in the repository after successful validation.

The separation improves testability but requires more wiring code. You need to call contracts explicitly and handle result objects. Database uniqueness constraints require additional handling since validation contracts can't easily check database state.

## Migrations and schema management

ActiveRecord migrations use a Ruby DSL:

```ruby
class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :username, null: false
      t.timestamps
    end
    
    add_index :users, :email, unique: true
  end
end
```

The migration DSL abstracts SQL into Ruby methods. The `change` method defines transformations that ActiveRecord can automatically reverse - creating a table reverses to dropping it. Rails tracks migrations through a `schema_migrations` table, running pending migrations in timestamp order.

ActiveRecord infers schema from the database at runtime. Models automatically gain attribute accessors for all columns without explicit declaration. This simplifies development but means schema mismatches only surface at runtime.

ROM uses SQL migration tools (typically Sequel):

```ruby
ROM::SQL.migration do
  change do
    create_table :users do
      primary_key :id
      String :email, null: false
      String :username, null: false
      DateTime :created_at
      DateTime :updated_at
      
      index :email, unique: true
    end
  end
end
```

ROM relations explicitly define schemas:

```ruby
class Users < ROM::Relation[:sql]
  schema(:users, infer: true) do
    attribute :id, Types::Serial
    attribute :email, Types::String
    attribute :username, Types::String
  end
end
```

Schema inference reads the database, but explicit definitions provide type information and catch mismatches early. The type system comes from dry-types, offering detailed specifications including optionality, constraints, and coercion rules. Type definitions enable automatic coercion - strings from HTTP params convert to integers, booleans parse from various formats.

The explicit approach requires maintaining schema definitions alongside migrations. When you add a column, you update both the migration and the relation schema. This duplication catches errors early and makes database structure visible in your code.

## Transaction handling

ActiveRecord wraps operations in transactions:

```ruby
ActiveRecord::Base.transaction do
  user = User.create!(email: 'user@example.com')
  profile = Profile.create!(user: user, bio: 'Hello')
end

# Manual rollback
ActiveRecord::Base.transaction do
  user = User.create!(email: 'user@example.com')
  raise ActiveRecord::Rollback if external_service_fails?
end
```

Transaction blocks ensure atomicity - either all operations succeed, or none do. Raising exceptions triggers rollbacks, and methods with `!` automatically roll back on failure. The global transaction API lets you wrap any model operations, with nested transactions using savepoints for partial rollbacks.

However, transactions coupled to models can obscure boundaries. Business logic touching multiple models might implicitly start transactions through callbacks, making it difficult to reason about what's transactional. Testing requires database connections and careful setup.

ROM handles transactions at the repository level:

```ruby
class UserRepository < ROM::Repository[:users]
  def create_user_with_profile(user_attrs, profile_attrs)
    users.transaction do
      user = users.command(:create).call(user_attrs)
      profile = profiles.command(:create).call(
        profile_attrs.merge(user_id: user.id)
      )
      [user, profile]
    end
  end
end

user, profile = user_repo.create_user_with_profile(
  { email: 'user@example.com' },
  { bio: 'Hello world' }
)
```

ROM transactions live in repositories where persistence logic belongs. Domain objects remain unaware of transactions, making boundaries explicit. Repository methods that need transactional behavior declare it directly, making it clear what operations execute atomically. The separation keeps transactions at the infrastructure layer while domain logic stays unaware of persistence concerns.

## Testing approaches

ActiveRecord testing typically requires database connections:

```ruby
RSpec.describe User, type: :model do
  it 'validates email presence' do
    user = User.new(email: nil)
    expect(user).not_to be_valid
  end
  
  it 'creates user with associations' do
    user = User.create!(email: 'user@example.com')
    post = user.posts.create!(title: 'Hello')
    expect(user.posts).to include(post)
  end
end
```

ROM separates domain logic from persistence:

```ruby
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
```

ROM's separation enables testing validations, domain logic, and data access independently.

## Framework integration

ActiveRecord integrates deeply with Rails:

```ruby
# Rails console automatically loads models
User.count

# Controllers work seamlessly
class UsersController < ApplicationController
  def create
    @user = User.new(user_params)
    if @user.save
      redirect_to @user
    else
      render :new
    end
  end
end
```

ROM requires explicit integration:

```ruby
# Configure ROM in initializer
ROM_CONTAINER = ROM.container(:sql, ENV['DATABASE_URL']) do |config|
  config.register_relation(Users)
end

# Make repositories available
class ApplicationController < ActionController::Base
  def user_repo
    @user_repo ||= UserRepository.new(ROM_CONTAINER)
  end
end

# Controllers use repositories
class UsersController < ApplicationController
  def create
    result = user_repo.create_user(user_params)
    if result.is_a?(ROM::Struct)
      redirect_to user_path(result)
    else
      @errors = result.errors
      render :new
    end
  end
end
```

Outside Rails, ROM works naturally without framework assumptions.

## Learning curve and adoption

ActiveRecord offers gentle learning curves:

```ruby
# Intuitive for beginners
user = User.new(email: 'user@example.com')
user.save

# Natural method chaining
User.where(active: true).order(:created_at).first

# Familiar patterns from other ORMs
user.posts.create(title: 'Hello')
```

Most Rails tutorials teach ActiveRecord from day one. The pattern feels natural for developers coming from Django ORM, Entity Framework, or other Active Record implementations.

Teams onboard quickly with ActiveRecord. The conventions mean less documentation and fewer architectural decisions. New developers contribute immediately without understanding data mapper patterns or functional composition.

ROM demands understanding multiple concepts:

```ruby
# Requires grasping relations, repositories, and entities
class Users < ROM::Relation[:sql]  # What's a relation?
  schema(:users, infer: true)      # Schema definition
end

class UserRepository < ROM::Repository[:users]  # Repository pattern
  commands :create                               # Command objects
  
  struct_namespace Entities  # Custom struct namespace
end

# Different mental model
user_repo.create(email: 'user@example.com')  # Repository, not model
```

The learning curve steepens with ROM's functional concepts: command objects, struct namespaces, changesets, and the separation between relations and repositories. Developers need time to internalize why this complexity exists.

Teams adopt ROM slowly. The architectural shift requires buy-in from everyone, not just database-layer changes. Training time increases, and productivity dips initially as developers learn new patterns.

## Final thoughts
ActiveRecord and ROM represent different philosophies for database access. ActiveRecord prioritizes developer convenience through conventions and tight database coupling. ROM prioritizes architectural clarity through explicit boundaries and functional composition.

For most Rails applications, ActiveRecord remains the practical choice. The conventions, ecosystem, and community support outweigh ROM's architectural advantages. Simple CRUD applications rarely justify ROM's additional complexity.