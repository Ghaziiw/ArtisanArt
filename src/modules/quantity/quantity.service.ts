import { Injectable } from '@nestjs/common';
import { CreateQuantityDto } from './dto/create-quantity.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';

@Injectable()
export class QuantityService {
  create(createQuantityDto: CreateQuantityDto) {
    return 'This action adds a new quantity';
  }

  findAll() {
    return `This action returns all quantity`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quantity`;
  }

  update(id: number, updateQuantityDto: UpdateQuantityDto) {
    return `This action updates a #${id} quantity`;
  }

  remove(id: number) {
    return `This action removes a #${id} quantity`;
  }
}
