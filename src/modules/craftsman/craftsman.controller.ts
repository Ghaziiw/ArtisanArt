import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CraftsmanService } from './craftsman.service';
import { CreateCraftsmanDto } from './dto/create-craftsman.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/types/auth-user';
import { Craftsman } from '../craftsman/craftsman.entity';
import { UpdateCraftsmanDto } from '../craftsman/dto/update-craftsman.dto';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/types/permissions.types';
import { UpdateCraftsmanExpDateDto } from './dto/update-craftsman-exp-date.dto';

@Controller('craftsmen')
@UseGuards(PermissionsGuard)
export class CraftsmanController {
  constructor(private readonly craftsmanService: CraftsmanService) {} // Inject CraftsmanService

  // GET /craftsmen → retrieve all craftsmen
  @Get()
  @Public()
  findAll() {
    return this.craftsmanService.findAll();
  }

  // GET /craftsmen/:id → retrieve a craftsman by user ID
  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.craftsmanService.findOneByUserId(id);
  }

  // POST /craftsmen → create a new craftsman
  @Post()
  @Public()
  create(@Body() craftsmanDto: CreateCraftsmanDto) {
    return this.craftsmanService.createCraftsman(craftsmanDto);
  }

  // GET /craftsmen/profile/me → get current craftsman's profile
  @Get('/profile/me')
  getMyProfile(@CurrentUser() user: AuthUser): Promise<Craftsman | null> {
    return this.craftsmanService.findOneByUserId(user.id);
  }

  // PATCH /craftsmen/profile/me → update current craftsman's profile
  @Patch('/profile/me')
  async updateCraftsmanProfile(
    @CurrentUser() user: AuthUser,
    @Body() updatedData: UpdateCraftsmanDto,
  ) {
    return this.craftsmanService.updateCraftsman(user.id, updatedData);
  }

  // Admin route to update any craftsman by user ID
  @Patch(':id')
  @RequirePermissions(Permission.CRAFTSMAN_UPDATE)
  async updateCraftsman(
    @Param('id') id: string,
    @Body() updatedData: UpdateCraftsmanDto,
  ) {
    return this.craftsmanService.updateCraftsman(id, updatedData);
  }

  // DELETE /craftsmen/:id → delete a craftsman by user ID
  @Delete(':id')
  @RequirePermissions(Permission.CRAFTSMAN_DELETE)
  async deleteCraftsman(@Param('id') id: string) {
    return this.craftsmanService.deleteCraftsman(id);
  }

  // PATCH /craftsmen/:id/exp → update craftsman's expiration date
  @Patch(':id/exp')
  @RequirePermissions(Permission.CRAFTSMAN_UPDATE_EXP)
  async updateCraftsmanExpDate(
    @Param('id') id: string,
    @Body() newExpDate: UpdateCraftsmanExpDateDto,
  ) {
    return this.craftsmanService.updateCraftsmanExpDate(id, newExpDate);
  }

  // DELETE /craftsmen/profile/me → delete current craftsman's profile
  @Delete('/profile/me')
  async deleteMyProfile(@CurrentUser() user: AuthUser) {
    return this.craftsmanService.deleteCraftsman(user.id);
  }
}
