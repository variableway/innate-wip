# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nestjs/
# Original language: typescript
# Normalized: ts
# Block index: 16

import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  // Override global settings for this route
  @Throttle(3, 60) // 3 requests per 60 seconds
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    // Login logic
  }
}