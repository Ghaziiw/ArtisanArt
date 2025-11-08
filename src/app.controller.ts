import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { RequirePermissions } from './auth/decorators/permissions.decorator';
import { Permission } from './auth/types/permissions.types';
import { PermissionsGuard } from './auth/guards/permissions.guard';

@Controller()
@UseGuards(PermissionsGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    console.log('Hello endpoint accessed');
    return this.appService.getHello();
  }

  @Get('private')
  getPrivate(): string {
    return 'Secret area 🕵️‍♂️';
  }

  @Get('admin')
  @RequirePermissions(Permission.ADMIN_PANEL)
  getAdmin(): string {
    return 'Admin area 👑';
  }
}
