# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: typescript
# Normalized: ts
# Block index: 26

@Injectable()
export class UserService {
  constructor(@InjectQueue('email-processing') private emailQueue: Queue) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    const user = await this.userRepository.save(userData);
    
    // Queue welcome email with retry configuration
    await this.emailQueue.add('welcome-email', 
      { userId: user.id }, 
      {
        delay: 5000,           // Wait 5 seconds before processing
        attempts: 3,           // Retry up to 3 times on failure
        backoff: 'exponential' // Use exponential backoff for retries
      }
    );
    
    return user;
  }
}