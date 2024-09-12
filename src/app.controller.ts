import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // Dependency Injection
  constructor(private readonly appService: AppService) {}

  @Get() // Decorator
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/hi')
  sayHi() {
    return 'hi there!';
  }
  @Get('/calc')
  calc() {
    return this.appService.calc();
  }
}
