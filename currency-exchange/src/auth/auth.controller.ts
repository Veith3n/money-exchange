import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UserDto } from 'src/api/user/dto/user.dto';

import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserSignedDto } from './dto/user-signed.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @ApiCreatedResponse({ type: UserSignedDto })
  async login(@Body() body: UserLoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  getProfile(@Request() req) {
    return req.user;
  }
}
