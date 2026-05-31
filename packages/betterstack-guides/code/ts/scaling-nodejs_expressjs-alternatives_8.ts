# Source: https://betterstack.com/community/guides/scaling-nodejs/expressjs-alternatives/
# Original language: typescript
# Normalized: ts
# Block index: 8

// users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Make UsersService available to other modules
})
export class UsersModule {}