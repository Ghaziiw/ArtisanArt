import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';
import { RequirePermissions } from './auth/decorators/permissions.decorator';
import { Permission } from './auth/types/permissions.types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
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
