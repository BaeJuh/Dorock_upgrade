import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from '../service/app.service';
// Model
import { DetailRequest } from 'src/model/DetailRequest';
import { ChatBotRequest } from 'src/model/ChatBotRequest';

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
  @Post('/tripInfoDetail') // chatbot
  async getTripInfoDetailChatBot(@Body() body: ChatBotRequest) {
    return this.appService.getTripInfoDetailChatBot(body.title, body.question);
  }
  // @Post("/aiPlanner")
}
