import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from '../service/app.service';
// Model
import { DetailRequest } from 'src/model/DetailRequest';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  index(): string {
    return this.appService.index();
  }

  @Get('/tripInfo')
  async getTripInfo() {
    return this.appService.getTripInfo();
  }
  @Post('/detail') // description
  async getTripInfoDetail(@Body() body: DetailRequest) {
    return this.appService.getTripInfoDetail(body.id);
  }
  // @Post("/tripInfoDetail") // chatbot
  // @Post("/aiPlanner")

  @Get('/test')
  async test() {
    // chatbot
    return this.appService.test();
  }
}
