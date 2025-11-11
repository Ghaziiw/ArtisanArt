import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offer.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/types/permissions.types';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/types/auth-user';
import { CreateOfferDto } from './dto/create-offer.dto';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Controller('offers')
@UseGuards(PermissionsGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  @Public()
  async findAll() {
    return this.offersService.findAll();
  }

  @Get(':productId')
  @Public()
  async findOne(productId: string) {
    return this.offersService.findOne(productId);
  }

  @Post()
  @RequirePermissions(Permission.OFFERS_CREATE)
  async create(
    @CurrentUser() user: AuthUser,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    return this.offersService.createOffer(createOfferDto, user.id);
  }

  @Patch(':productId')
  @RequirePermissions(Permission.OFFERS_UPDATE)
  async update(
    @Body() updateOfferDto: UpdateOfferDto,
    @CurrentUser() user: AuthUser,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.offersService.updateOffer(productId, updateOfferDto, user.id);
  }

  @Delete(':productId')
  @RequirePermissions(Permission.OFFERS_DELETE)
  async delete(
    @Param('productId', ParseUUIDPipe) productId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.offersService.deleteOffer(productId, user.id);
  }
}
