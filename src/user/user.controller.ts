import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/types/permissions.types';
import { DeleteResult } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/types/auth-user';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /users → retrieve all users
  @Get()
  @RequirePermissions(Permission.USERS_VIEW)
  getAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
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
    @Body() updateData: UpdateProfileDto,
  ): Promise<UserEntity> {
    return this.userService.updateProfile(id, updateData);
  }

  // PATCH /users/profile/me → update current user's profile
  @Patch('/profile/me')
  updateMyProfile(
    @CurrentUser() user: AuthUser,
    @Body() updateData: UpdateProfileDto,
  ): Promise<UserEntity> {
    return this.userService.updateProfile(user.id, updateData);
  }

  // GET /users/profile/me → get current user's profile
  @Get('/profile/me')
  getMyProfile(@CurrentUser() user: AuthUser): Promise<UserEntity | null> {
    return this.userService.findOne(user.id);
  }
}
