# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-express/
# Original language: typescript
# Normalized: ts
# Block index: 10

import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;
}