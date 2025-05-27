import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/entities/user/user.entity';
import { UserService } from 'src/models/entities/user/user.service';
import { CurrencyCode } from 'src/types/currency-codes.enum';

import { WalletApiService } from '../wallet/wallet.api.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserApiService {
  constructor(
    private readonly userService: UserService,
    private readonly walletApiService: WalletApiService,
  ) {}

  /**
   * Creates a new user.
   * @param {CreateUserDto} createUserDto - The data transfer object containing user details.
   * @returns {Promise<UserDto>} The created user dto.
   * @throws {UserExistsError} If a user with the given email already exists.
   */
  public async create(userDto: CreateUserDto): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    const createdUser = await this.userService.create({
      ...userDto,
      password: hashedPassword,
    });

    // Create a wallet for the user with PLN currency
    await this.walletApiService.topUp(createdUser.id, CurrencyCode.PLN, 0);

    return this.mapUserToDto(createdUser);
  }

  private mapUserToDto(user: User): UserDto {
    return {
      email: user.email,
    };
  }
}
