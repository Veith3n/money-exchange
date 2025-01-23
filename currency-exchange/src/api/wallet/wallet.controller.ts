import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { JwtUser } from 'src/auth/jwt.strategy';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserFromBearer } from 'src/decorators/user-from-request';

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
}
