import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('API')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Public()
  getInfo() {
    return this.appService.getInfo();
  }
}
