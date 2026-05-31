# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-express/
# Original language: typescript
# Normalized: ts
# Block index: 16

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }
}