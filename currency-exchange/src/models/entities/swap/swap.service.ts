import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';

import { Swap, SwapCreateDto } from './swap.entity';

@Injectable()
export class SwapService {
  constructor(
    @InjectRepository(Swap)
    private readonly swapRepository: Repository<Swap>,
  ) {}

  public create(swapCreateDto: SwapCreateDto): Promise<Swap> {
    const swap = this.swapRepository.create(swapCreateDto);

    return this.swapRepository.save(swap);
  }

  public async getAllForUser(userId: number): Promise<Swap[]> {
    return this.swapRepository.findBy({ userId });
  }
}
