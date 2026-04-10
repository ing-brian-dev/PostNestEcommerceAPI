import { Controller, Get, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('v1/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  getPost(){
    return this.appService.postHello();
  }


}
