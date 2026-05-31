# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nestjs/
# Original language: typescript
# Normalized: ts
# Block index: 8

@Get('users')
async findAll() {
  // If this throws an error, NestJS will catch and process it
  return await this.usersService.findAll();
}