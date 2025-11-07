import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CraftsmanEntity } from './craftsman.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CraftsmanService {
  constructor(
    @InjectRepository(CraftsmanEntity)
    private readonly craftsmanRepository: Repository<CraftsmanEntity>, // Repository TypeORM pour CraftsmanEntity
  ) {}
}
