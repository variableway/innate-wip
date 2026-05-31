# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: typescript
# Normalized: ts
# Block index: 25

import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('email-processing')
export class EmailProcessor {
  constructor(private emailService: EmailService) {}

  @Process('welcome-email')
  async sendWelcomeEmail(job: Job<{ userId: number }>) {
    const { userId } = job.data;
    
    try {
      const user = await this.userService.findById(userId);
      await this.emailService.sendWelcomeEmail(user.email, user.name);
      
      console.log(`Welcome email sent successfully to user ${userId}`);
    } catch (error) {
      console.error(`Failed to send welcome email to user ${userId}:`, error);
      throw error; // This will trigger job retry
    }
  }

  @Process('newsletter')
  async sendNewsletter(job: Job<{ userIds: number[]; newsletterId: string }>) {
    const { userIds, newsletterId } = job.data;
    
    for (const userId of userIds) {
      await this.emailService.sendNewsletter(userId, newsletterId);
    }
  }
}