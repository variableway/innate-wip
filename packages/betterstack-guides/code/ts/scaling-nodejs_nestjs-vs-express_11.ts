# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-express/
# Original language: typescript
# Normalized: ts
# Block index: 11

@Controller('users')
export class UsersController {
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}