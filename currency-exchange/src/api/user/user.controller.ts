import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UserExistsError } from 'src/models/entities/user/user.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UserApiService } from './user.api.service';

@Controller('api/users')
export class UserController {
  constructor(private readonly userApiService: UserApiService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const createdUser = await this.userApiService.create(createUserDto);

      return createdUser;
    } catch (error: unknown) {
      if (error instanceof UserExistsError) {
        throw new BadRequestException(
          'User with the given email already exists',
        );
      }
    }
  }
}
