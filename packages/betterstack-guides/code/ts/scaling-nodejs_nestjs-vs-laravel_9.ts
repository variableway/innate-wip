# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-laravel/
# Original language: typescript
# Normalized: ts
# Block index: 9

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @OneToMany(() => Post, post => post.author)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async findByEmail(email: string) {
    return this.userRepo.findOne({ 
      where: { email },
      relations: ['posts'] 
    });
  }

  async createUser(userData: CreateUserDto) {
    const user = this.userRepo.create(userData);
    return this.userRepo.save(user);
  }
}