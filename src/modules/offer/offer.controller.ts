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
import { OfferService } from './offer.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/types/permissions.types';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/types/auth-user';
import { CreateOfferDto } from './dto/create-offer.dto';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './offer.entity';

@Controller('offers')
@UseGuards(PermissionsGuard)
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  // GET /offers → retrieve all offers
  @Get()
  @Public()
  async findAll(): Promise<Offer[]> {
    return this.offerService.findAll();
  }

  // GET /offers/:productId → retrieve an offer by product ID
  @Get(':productId')
  @Public()
  async findOne(productId: string) {
    return this.offerService.findOne(productId);
  }

  // POST /offers → create a new offer
  @Post()
  @RequirePermissions(Permission.OFFERS_CREATE)
  async create(
    @CurrentUser() user: AuthUser,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    return this.offerService.createOffer(createOfferDto, user.id);
  }

  // PATCH /offers/:productId → update an existing offer
  @Patch(':productId')
  @RequirePermissions(Permission.OFFERS_UPDATE)
  async update(
    @Body() updateOfferDto: UpdateOfferDto,
    @CurrentUser() user: AuthUser,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.offerService.updateOffer(productId, updateOfferDto, user.id);
  }

  // DELETE /offers/:productId → delete an offer by product ID
  @Delete(':productId')
  @RequirePermissions(Permission.OFFERS_DELETE)
  async delete(
    @Param('productId', ParseUUIDPipe) productId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.offerService.deleteOffer(productId, user.id);
  }
}
