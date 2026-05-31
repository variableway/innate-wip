# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-express/
# Original language: typescript
# Normalized: ts
# Block index: 18

// src/users/users.service.spec.ts
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UsersService, { provide: getModelToken('User'), useValue: mockUserModel }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create a user', async () => {
    const userData = { name: 'John', email: 'john@example.com' };
    const result = await service.create(userData);
    expect(result.name).toBe(userData.name);
  });
});