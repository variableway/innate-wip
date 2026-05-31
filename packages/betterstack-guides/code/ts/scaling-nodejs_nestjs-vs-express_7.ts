# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-express/
# Original language: typescript
# Normalized: ts
# Block index: 7

import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body() body: { name: string; email: string }) {
    const { name, email } = body;
    return this.usersService.create(name, email);
  }
}