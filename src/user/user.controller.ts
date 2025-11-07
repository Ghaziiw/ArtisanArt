import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/types/permissions.types';
import { DeleteResult } from 'typeorm';

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
}
