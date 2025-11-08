import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CraftsmanService } from './craftsman.service';
import { CreateCraftsmanDto } from './dto/create-craftsman.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
// import { CraftsmanEntity } from './craftsman.entity';

@Controller('craftsmen')
@UseGuards(PermissionsGuard)
export class CraftsmanController {
  constructor(private readonly craftsmanService: CraftsmanService) {}

  @Get()
  findAll() {
    return this.craftsmanService.findAll();
  }

  @Post()
  @Public()
  create(@Body() craftsmanDto: CreateCraftsmanDto) {
    return this.craftsmanService.createCraftsman(craftsmanDto);
  }
}
