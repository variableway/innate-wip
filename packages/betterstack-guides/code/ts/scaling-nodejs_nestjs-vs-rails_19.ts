# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-rails/
# Original language: typescript
# Normalized: ts
# Block index: 19

describe('PostsService', () => {
  let service: PostsService;
  let mockRepository: jest.Mocked<Repository<Post>>;

  beforeEach(async () => {
    const mockRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepo
        }
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    mockRepository = module.get(getRepositoryToken(Post));
  });

  it('should find published posts', async () => {
    const mockPosts = [
      { id: 1, title: 'Test Post', published: true },
      { id: 2, title: 'Another Post', published: true }
    ];

    mockRepository.find.mockResolvedValue(mockPosts as Post[]);

    const result = await service.findPublished();

    expect(mockRepository.find).toHaveBeenCalledWith({
      where: { published: true },
      relations: ['author'],
      order: { createdAt: 'DESC' }
    });
    expect(result).toEqual(mockPosts);
  });
});