import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import * as packageJson from '../package.json';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Get('health/version')
  healthVersion() {
    return {
      name: packageJson.name,
      version: packageJson.version,
    };
  } // <--- Chave e parêntese fechados aqui!

  @Get('demo/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  demoAdmin() {
    return { ok: true, area: 'admin' };
  }

  @Get('demo/client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  demoClient() {
    return { ok: true, area: 'client' };
  }
}