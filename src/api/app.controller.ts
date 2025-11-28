import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller({
  version: VERSION_NEUTRAL,
})
export class AppController {
  constructor() {}
  @Get()
  getHello(): { message: string } {
    return { message: 'Welcome to the WCC API Service' };
  }
}
