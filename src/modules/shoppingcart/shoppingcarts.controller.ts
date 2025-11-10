import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShoppingcartsService } from './shoppingcarts.service';
import { CreateShoppingcartDto } from './dto/create-shoppingcart.dto';
import { UpdateShoppingcartDto } from './dto/update-shoppingcart.dto';

@Controller('shoppingcarts')
export class ShoppingcartsController {
  constructor(private readonly shoppingcartsService: ShoppingcartsService) {}

  @Post()
  create(@Body() createShoppingcartDto: CreateShoppingcartDto) {
    return this.shoppingcartsService.create(createShoppingcartDto);
  }

  @Get()
  findAll() {
    return this.shoppingcartsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoppingcartsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShoppingcartDto: UpdateShoppingcartDto) {
    return this.shoppingcartsService.update(+id, updateShoppingcartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoppingcartsService.remove(+id);
  }
}
