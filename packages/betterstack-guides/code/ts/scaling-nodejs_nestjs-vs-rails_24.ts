# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: typescript
# Normalized: ts
# Block index: 24

// email.module.ts
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email-processing',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [EmailService, EmailProcessor],
})
export class EmailModule {}