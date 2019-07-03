import { Controller, Get } from '@nestjs/common';

@Controller('/test')
export class AppController {
  @Get('/first')
  firstTest() {
    return 'Welcome to Weteeit API';
  }
}
