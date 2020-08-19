import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      apiName: process.env.API_NAME,
      environment: process.env.NODE_ENV,
      now: new Date(),
      version: process.env.API_VERSION,
    };
  }
}
