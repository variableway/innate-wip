# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-laravel/
# Original language: typescript
# Normalized: ts
# Block index: 2

// users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(): User[] {
    return this.usersService.findAll();
  }
  
  @Post()
  create(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }
}