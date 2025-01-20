import { Injectable } from '@nestjs/common';
import { User } from 'src/models/entities/user/user.entity';
import { UserService } from 'src/models/entities/user/user.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserApiService {
  constructor(private readonly userService: UserService) {}

  /**
   * Creates a new user.
   * @param {CreateUserDto} createUserDto - The data transfer object containing user details.
   * @returns {Promise<UserDto>} The created user dto.
   * @throws {UserExistsError} If a user with the given email already exists.
   */
  public async create(userDto: CreateUserDto): Promise<UserDto> {
    const createdUser = await this.userService.create(userDto);

    return this.mapUserToDto(createdUser);
  }

  private mapUserToDto(user: User): UserDto {
    return {
      email: user.email,
    };
  }
}
