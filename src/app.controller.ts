import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as packageJson from '../package.json';

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
  }
}