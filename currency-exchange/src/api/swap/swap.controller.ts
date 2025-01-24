import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { JwtUser } from 'src/auth/jwt.strategy';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserFromBearer } from 'src/decorators/user-from-request';

import { SwapDto } from './dto/swap.dto';
import { SwapApiService } from './swap.api.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('api/swaps')
export class SwapController {
  constructor(private readonly swapApiService: SwapApiService) {}

  @Get()
  @ApiOperation({ summary: 'Get swaps for current user' })
  @ApiOkResponse({ type: SwapDto, isArray: true })
  async getSwaps(@UserFromBearer() user: JwtUser): Promise<SwapDto[]> {
    const swaps = await this.swapApiService.getSwaps(user.userId);

    return swaps;
  }
}
