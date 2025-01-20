import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';

import { User } from './user.entity';

interface CreateUserDto {
  email: string;
  password: string;
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

  public create(user: CreateUserDto): Promise<User> {
    return this.userRepo.save(user);
  }
}
