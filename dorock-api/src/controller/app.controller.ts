import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from '../service/app.service';
// Model
import { DetailRequest } from 'src/model/DetailRequest';
import { ChatBotRequest } from 'src/model/ChatBotRequest';
import { AIPlannerRequest } from 'src/model/AIplannerRequest';

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
  async postTripInfoDetailChatBot(@Body() body: ChatBotRequest) {
    return this.appService.postTripInfoDetailChatBot(body.title, body.question);
  }
  @Post('/aiPlanner')
  async getAIPlanner(@Body() body: AIPlannerRequest) {
    return this.appService.getAIPlanner(body);
  }
}
