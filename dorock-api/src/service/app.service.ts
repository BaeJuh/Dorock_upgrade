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
      })
      .sort(() => Math.random() - 0.5);

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

    // ai 자리

    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    });

    const prompt = `요청사항:
                1. 관광지 : ${detailInfo.title} 주소 : ${detailInfo.addr1}에 대한 여행지 정보를 알려줘
                2. 반환 해줄때 ** **을 이용한 강조를 빼줘.
                3. 3줄안으로 설명해줘`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    return new DetailItem.Builder()
      .setAddr1(detailInfo.addr1)
      .setAddr2(detailInfo.addr2)
      .setTitle(detailInfo.title)
      .setFirstimage(detailInfo.firstimage)
      .setMapx(detailInfo.mapx)
      .setMapy(detailInfo.mapy)
      .setRecommendation(response.text || '')
      .build();
  }

  async getTripInfoDetailChatBot(
    title: string,
    question: string,
  ): Promise<string> {
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    });

    const prompt = `요청사항:
                    ${question}이 ${title}와 거리가 멀면 응답을 "${title}에 대해 물어봐주세요."로만 응답해줘
                    주어가 없다면 강원도의 ${title + question}에 관련된 내용을 강조 없이 반환해주면 돼.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    return response.text || 'No response from AI';
  }
}
