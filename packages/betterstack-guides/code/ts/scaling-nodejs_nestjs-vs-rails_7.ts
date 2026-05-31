# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: typescript
# Normalized: ts
# Block index: 7

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>
  ) {}

  async findPublished(): Promise<Post[]> {
    return this.postRepository.find({
      where: { published: true },
      relations: ['author'],
      order: { createdAt: 'DESC' }
    });
  }

  async createPost(postData: CreatePostDto, authorId: number): Promise<Post> {
    const post = this.postRepository.create({
      ...postData,
      author: { id: authorId }
    });
    return this.postRepository.save(post);
  }
}