# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-laravel/
# Original language: typescript
# Normalized: ts
# Block index: 15

describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const mockRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    mockRepository = module.get(getRepositoryToken(User));
  });

  it('should find user by email', async () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test' };
    mockRepository.findOne.mockResolvedValue(mockUser as User);

    const result = await service.findByEmail('test@example.com');
    
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { email: 'test@example.com' }
    });
    expect(result).toEqual(mockUser);
  });
}