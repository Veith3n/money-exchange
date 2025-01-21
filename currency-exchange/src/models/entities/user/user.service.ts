import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';

import { User } from './user.entity';

interface CreateUserDto {
  email: string;
  password: string;
}

// TODO: move it
export class UserExistsError extends Error {
  constructor() {
    super('User already exists');
  }
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  public get(userId: User['id']): Promise<User> {
    return this.userRepo.findOneByOrFail({ id: userId });
  }

  /**
   * Creates a new user.
   * @param {CreateUserDto} createUserDto - The data transfer object containing user details.
   * @returns {Promise<User>} The created user.
   * @throws {UserExistsError} If a user with the given email already exists.
   */
  public async create(user: CreateUserDto): Promise<User> {
    const userExists = await this.userRepo.exists({
      where: { email: user.email },
    });

    if (userExists) {
      throw new UserExistsError();
    }

    return this.userRepo.save(user);
  }
}
