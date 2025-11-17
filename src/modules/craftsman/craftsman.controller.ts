import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { CraftsmanFilterDto } from './dto/craftsman-filter.dto';
import { UploadService } from '../upload/upload.service';
import { multerConfig } from 'src/config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('craftsmen')
@UseGuards(PermissionsGuard)
export class CraftsmanController {
  constructor(
    private readonly craftsmanService: CraftsmanService,
    private readonly uploadService: UploadService,
  ) {} // Inject CraftsmanService

  // GET /craftsmen → retrieve all craftsmen
  @Get()
  @Public()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query() rawQuery: Record<string, any>,
  ) {
    const filters: CraftsmanFilterDto = rawQuery;
    return this.craftsmanService.findAll(page, limit, filters);
  }

  // GET /craftsmen/admin → retrieve all craftsmen (admin view)
  @Get('/admin')
  @RequirePermissions(Permission.CRAFTSMAN_VIEW)
  findAllAdmin(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query() rawQuery: Record<string, any>,
  ) {
    const filters: CraftsmanFilterDto = rawQuery;
    return this.craftsmanService.findAll(page, limit, filters, true);
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
    return this.craftsmanService.findOneByUserId(user.id, true);
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

  // PATCH /craftsmen/profile/me/image → update current craftsman's profile image
  @Patch('/profile/me/image')
  @UseInterceptors(FileInterceptor('profileImage', multerConfig))
  async updateMyProfileImage(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Validate file
    this.uploadService.validateFile(file);

    // Generate image URL
    const imageUrl = this.uploadService.getFileUrl(file.filename, 'profiles');

    return this.craftsmanService.updateCraftsman(user.id, { image: imageUrl });
  }
}
