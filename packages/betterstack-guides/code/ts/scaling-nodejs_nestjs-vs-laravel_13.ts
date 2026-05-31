# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-laravel/
# Original language: typescript
# Normalized: ts
# Block index: 13

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}

@Controller('posts')
@UseGuards(AuthGuard('jwt'))
export class PostsController {
  @Post()
  @UseGuards(PostOwnershipGuard)
  create(@Request() req, @Body() createDto: CreatePostDto) {
    return this.postsService.create(createDto, req.user.id);
  }
}

// Custom authorization logic
@Injectable()
export class PostOwnershipGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const postId = request.params.id;
    const userId = request.user.id;
    
    const post = await this.postsService.findById(postId);
    return post?.authorId === userId;
  }
}