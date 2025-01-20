import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';

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
    return this.userApiService.create(createUserDto);
  }
}
