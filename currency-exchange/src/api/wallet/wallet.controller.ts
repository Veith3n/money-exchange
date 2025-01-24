import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtUser } from 'src/auth/jwt.strategy';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserFromBearer } from 'src/decorators/user-from-request';

import { TopUpWalletDto } from './dto/top-up-wallet.dto';
import { WalletDto } from './dto/wallet.dto';
import { WalletApiService } from './wallet.api.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/wallets')
export class WalletController {
  constructor(private readonly walletApiService: WalletApiService) {}

  @Get()
  @ApiOperation({ summary: 'Get wallets for current user' })
  @ApiOkResponse({ type: WalletDto, isArray: true })
  async getWallets(@UserFromBearer() user: JwtUser): Promise<WalletDto[]> {
    const wallets = await this.walletApiService.getWallets(user.userId);

    return wallets;
  }

  @Post('top-up')
  @ApiOperation({
    summary:
      'Tops up wallet for given currency if not exits for given currency creates new one',
  })
  @ApiCreatedResponse({ type: WalletDto })
  @ApiBadRequestResponse()
  async topUp(
    @Body() topUpWalletDto: TopUpWalletDto,
    @UserFromBearer() user: JwtUser,
  ): Promise<WalletDto> {
    const { currencyCode, amount } = topUpWalletDto;

    const wallet = await this.walletApiService.topUp(
      user.userId,
      currencyCode,
      parseFloat(amount),
    );

    return wallet;
  }
}
