import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/entities/user/user.entity';
import { UserService } from 'src/models/entities/user/user.service';

import { UserSignedDto } from './dto/user-signed.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      return undefined;
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      return undefined;
    }

    return user;
  }

  login(user: User): UserSignedDto {
    const payload: JwtPayload = {
      username: user.email,
      sub: user.id.toString(),
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
