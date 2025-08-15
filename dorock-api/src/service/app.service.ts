import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleGenAI } from '@google/genai';
// Entity
import { Areacode } from '../entity/Areacode';
import { TouristSpot } from '../entity/TouristSpot';
// Model
import { AreaCodeItem } from '../model/AreaCodeItem';
import { TouristSpotItem } from '../model/TouristSpotItem';
import { TripInfoResponse } from 'src/model/TripInfoResponse';
import { DetailItem } from 'src/model/DetailItem';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Areacode)
    private readonly areacodeRepository: Repository<Areacode>,
    @InjectRepository(TouristSpot)
    private readonly touristSpotRepository: Repository<TouristSpot>,
  ) {}

  index(): string {
    return 'Welcome to Site of Chat GPT with Tour Api BackEnd URL';
  }

  async getTripInfo(): Promise<TripInfoResponse> {
    const touristSpot = (await this.touristSpotRepository.find())
      .filter((spot) => spot.contenttypeid === '12')
      .map((spot) => {
        return new TouristSpotItem.Builder()
          .setId(spot.id)
          .setAddr1(spot.addr1)
          .setAddr2(spot.addr2)
          .setAreacode(spot.areacode)
          .setBooktour(spot.booktour)
          .setCat1(spot.cat1)
          .setCat2(spot.cat2)
          .setCat3(spot.cat3)
          .setContentid(spot.contentid)
          .setContenttypeid(spot.contenttypeid)
          .setCreatedtime(spot.createdtime)
          .setFirstimage(spot.firstimage)
          .setFirstimage2(spot.firstimage2)
          .setCpyrhtdivcd(spot.cpyrhtdivcd)
          .setMapx(spot.mapx)
          .setMapy(spot.mapy)
          .setMlevel(spot.mlevel)
          .setModifiedtime(spot.modifiedtime)
          .setSigungucode(spot.sigungucode)
          .setTel(spot.tel)
          .setTitle(spot.title)
          .setZipcode(spot.zipcode)
          .build();
      });

    const areacodeList = (await this.areacodeRepository.find()).map(
      (areacode) => {
        return new AreaCodeItem.Builder()
          .setRnum(areacode.rnum)
          .setCode(areacode.code)
          .setName(areacode.name)
          .build();
      },
    );

    return new TripInfoResponse()
      .setTouristSpot(touristSpot)
      .setAreaCode(areacodeList);
  }

  async getTripInfoDetail(id: number): Promise<DetailItem> {
    const detailInfo = await this.touristSpotRepository.findOne({
      where: { id },
    });

    if (!detailInfo)
      throw new NotFoundException(`Tourist spot with id ${id} not found`);

    // console.log(detailInfo);

    // gpt 자리

    return new DetailItem.Builder()
      .setAddr1(detailInfo.addr1)
      .setAddr2(detailInfo.addr2)
      .setTitle(detailInfo.title)
      .setFirstimage(detailInfo.firstimage)
      .setMapx(detailInfo.mapx)
      .setMapy(detailInfo.mapy)
      .build();
  }

  async test(): Promise<any> {
    const ai = new GoogleGenAI({
      apiKey: '',
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: '잘 작동되고 있니? ',
    });

    return response;
  }
}
