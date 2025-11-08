import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/types/permissions.types';
import { DeleteResult } from 'typeorm';
import { ChangePasswordDto, UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/types/auth-user';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

@Controller('users')
@UseGuards(PermissionsGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /users → retrieve all users
  @Get()
  @RequirePermissions(Permission.USERS_VIEW)
  getAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  // PATCH /users/profile/me → update current user's profile
  @Patch('/profile/me')
  updateMyProfile(
    @CurrentUser() user: AuthUser,
    @Body() updatedData: UpdateProfileDto,
  ): Promise<UserEntity> {
    return this.userService.updateProfile(user.id, updatedData);
  }

  // GET /users/profile/me → get current user's profile
  @Get('/profile/me')
  getMyProfile(@CurrentUser() user: AuthUser) {
    return this.userService.findOne(user.id);
  }

  // PATCH /users/profile/password → change current user's password
  @Patch('/profile/password')
  async updatePassword(
    @CurrentUser() user: AuthUser,
    @Body() passwordData: ChangePasswordDto,
    @Req() request: Request, // Ajoutez ceci
  ) {
    await this.userService.changePassword(
      user.id,
      passwordData,
      request.headers as unknown as Record<string, string>, // Passez les headers
    );
    return { message: 'Password changed successfully' };
  }

  // GET /users/:id → retrieve a user by ID
  @Get(':id')
  @RequirePermissions(Permission.USERS_VIEW)
  getOne(@Param('id') id: string): Promise<UserEntity | null> {
    return this.userService.findOne(id);
  }

  // DELETE /users/:id → delete a user by ID (admin only)
  @Delete(':id')
  @RequirePermissions(Permission.USERS_DELETE)
  deleteUser(@Param('id') id: string): Promise<DeleteResult> {
    return this.userService.deleteUserAdmin(id);
  }

  // PATCH /users/:id → update a user's profile (admin only)
  @Patch(':id')
  @RequirePermissions(Permission.USERS_UPDATE)
  updateUser(
    @Param('id') id: string,
    @Body() updatedData: UpdateProfileDto,
  ): Promise<UserEntity> {
    return this.userService.updateProfile(id, updatedData);
  }

  // POST /users → create a new user (admin only)
  @Post()
  @RequirePermissions(Permission.USERS_CREATE)
  createUser(@Body() userData: Partial<UserEntity>): Promise<UserEntity> {
    return this.userService.createUser(userData);
  }
}
