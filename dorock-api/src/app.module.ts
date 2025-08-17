import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// Entity
import { Areacode } from './entity/Areacode';
import { TouristSpot } from './entity/TouristSpot';
import { NonBlankTouristSpot } from './entity/NonBlankTouristSpot';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Areacode, TouristSpot, NonBlankTouristSpot],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Areacode, TouristSpot, NonBlankTouristSpot]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
