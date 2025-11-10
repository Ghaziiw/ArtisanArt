import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuantityService } from './quantity.service';
import { CreateQuantityDto } from './dto/create-quantity.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';

@Controller('quantity')
export class QuantityController {
  constructor(private readonly quantityService: QuantityService) {}

  @Post()
  create(@Body() createQuantityDto: CreateQuantityDto) {
    return this.quantityService.create(createQuantityDto);
  }

  @Get()
  findAll() {
    return this.quantityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quantityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuantityDto: UpdateQuantityDto) {
    return this.quantityService.update(+id, updateQuantityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quantityService.remove(+id);
  }
}
