import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entity
import { Areacode } from './entity/Areacode';
import { TouristSpot } from './entity/TouristSpot';
import { NonBlankTouristSpot } from './entity/NonBlankTouristSpot';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'dorock',
      entities: [Areacode, TouristSpot, NonBlankTouristSpot],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Areacode, TouristSpot, NonBlankTouristSpot]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
