# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-laravel/
# Original language: typescript
# Normalized: ts
# Block index: 3

[label users.service.ts]
@Injectable()
export class UsersService {
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  create(userData: CreateUserDto): User {
    const user = { id: Date.now(), ...userData };
    this.users.push(user);
    return user;
  }
}

// users.module.ts
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}