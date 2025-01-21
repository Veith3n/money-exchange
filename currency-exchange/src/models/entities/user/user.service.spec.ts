import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';

import { User } from './user.entity';
import { UserExistsError, UserService } from './user.service';

describe(`${UserService.name}`, () => {
  let service: UserService;
  let repository: Repository<User>;

  const repoMock = {
    findOneByOrFail: jest.fn(),
    exists: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    const methodCall = (userId: number) => service.get(userId);

    it('should return a user by id', async () => {
      const userId = 1;
      const user = new User();
      user.id = userId;
      user.email = 'test@example.com';
      user.password = 'password';

      repoMock.findOneByOrFail.mockResolvedValue(user);

      expect(await methodCall(userId)).toEqual(user);
    });

    it('should throw an error if user is not found', async () => {
      const userId = 1;

      repoMock.findOneByOrFail.mockRejectedValue(new Error('User not found'));

      await expect(methodCall(userId)).rejects.toThrow('User not found');
    });
  });

  describe('create', () => {
    const methodCall = (createUserDto) => service.create(createUserDto);

    const createUserDto = {
      email: 'test@example.com',
      password: 'password',
    };

    it('should create a new user', async () => {
      const user = new User();
      user.email = createUserDto.email;
      user.password = createUserDto.password;

      repoMock.exists.mockResolvedValue(false);
      repoMock.save.mockResolvedValue(user);

      expect(await methodCall(createUserDto)).toEqual(user);
    });

    it('should throw UserExistsError if user with email already exists', async () => {
      repoMock.exists.mockResolvedValue(true);

      await expect(methodCall(createUserDto)).rejects.toThrow(UserExistsError);
    });
  });
});
