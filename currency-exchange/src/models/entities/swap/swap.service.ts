import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';

import { Swap } from './swap.entity';

@Injectable()
export class SwapService {
  constructor(
    @InjectRepository(Swap)
    private readonly swapRepository: Repository<Swap>,
  ) {}

  public async getAllForUser(userId: number): Promise<Swap[]> {
    return this.swapRepository.findBy({ userId });
  }
}
