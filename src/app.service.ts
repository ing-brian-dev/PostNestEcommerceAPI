import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Nest js!';
  }

  postHello(): string {
    return "Desde @Post en el service"
  }
}
