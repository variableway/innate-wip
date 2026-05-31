# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-laravel/
# Original language: typescript
# Normalized: ts
# Block index: 19

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-queue',
      redis: { host: 'localhost', port: 6379 },
    }),
  ],
})
export class EmailModule {}

@Processor('email-queue')
export class EmailProcessor {
  @Process('welcome-email')
  async sendWelcomeEmail(job: Job<{ userId: number; email: string }>) {
    const { userId, email } = job.data;
    
    try {
      await this.emailService.send(email, 'welcome-template');
      console.log(`Welcome email sent to ${email}`);
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
      throw error; // Bull will retry automatically
    }
  }
  
  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    console.log(`Job ${job.id} failed: ${err.message}`);
  }
}

@Injectable()
export class UserService {
  constructor(@InjectQueue('email-queue') private emailQueue: Queue) {}

  async createUser(userData: CreateUserDto) {
    const user = await this.userRepo.save(userData);
    
    // Queue welcome email with retry logic
    await this.emailQueue.add('welcome-email', {
      userId: user.id,
      email: user.email,
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      delay: 5000, // Wait 5 seconds before sending
    });
    
    return user;
  }
}