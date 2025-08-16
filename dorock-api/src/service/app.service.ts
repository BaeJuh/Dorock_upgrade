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
import { AIPlannerRequest } from 'src/model/AIplannerRequest';
import { AIPlannerItem } from 'src/model/AIPlannerItem';
// Interface
import { AIResponseObj } from 'src/interface/AIResponseObj';
import { NonBlankTouristSpot } from 'src/entity/NonBlankTouristSpot';

@Injectable()
export class AppService {
  private readonly ai: GoogleGenAI;
  constructor(
    @InjectRepository(Areacode)
    private readonly areacodeRepository: Repository<Areacode>,
    @InjectRepository(TouristSpot)
    private readonly touristSpotRepository: Repository<TouristSpot>,
    @InjectRepository(NonBlankTouristSpot)
    private readonly nonBlankTouristSpotRepository: Repository<NonBlankTouristSpot>,
  ) {
    this.ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    });
  }

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

    const prompt = `요청사항:
                1. 관광지 : ${detailInfo.title} 주소 : ${detailInfo.addr1}에 대한 여행지 정보를 알려줘
                2. 반환 해줄때 ** **을 이용한 강조를 빼줘.
                3. 3줄안으로 설명해줘`;

    const response = await this.ai.models.generateContent({
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

  async postTripInfoDetailChatBot(
    title: string,
    question: string,
  ): Promise<string> {
    const prompt = `요청사항:
                    ${question}이 ${title}와 거리가 멀면 응답을 "${title}에 대해 물어봐주세요."로만 응답해줘
                    주어가 없다면 강원도의 ${title + question}에 관련된 내용을 강조 없이 반환해주면 돼.`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    if (!response) throw new Error('No response from AI');

    return response.text || 'No response from AI';
  }

  async getAIPlanner(body: AIPlannerRequest): Promise<AIPlannerItem> {
    const prompt = `
      다음 JSON 데이터를 참고하여 각 value 코드에 해당하는 추천 장소를 JSON 형식으로 반환해 주세요.

            JSON 데이터:
            ${JSON.stringify(body)}

            설명:
            - "region"과 "category"는 각각 여행지와 관련된 정보의 카테고리입니다.
            - "region"의 "key" 값들은 지역 이름이며, 그에 대한 "value"는 각 지역을 식별하는 코드입니다.
            - "category"의 "key" 값들은 활동이나 주제(레저, 역사 등)이며, 그에 대한 "value"는 카테고리 코드입니다.

            요청 사항:
            1. **반환 형식**은 "result"라는 JSON 객체 안에 넣어 반환해 주세요.
            2. 각 "value" 값을 "key"로 사용하여 결과를 반환하고, 모든 "key"에 대해 **항상 누락 없이 포함**해 주세요.
            3. **각 "value" 코드마다 추천 장소를 2개 이상 7개 이하씩 리스트 형식으로 제공**해 주세요.
            4. 모든 추천 장소는 **공백 없이 리스트 형식**으로 반환해 주세요.
            5. **반환 형식이 일정하게 유지되도록** 항상 동일한 구조로 제공해 주세요.
            6. JSON 형식의 응답을 위해, 응답에 여타 설명 없이 **JSON 데이터만 반환해 주세요**.
            7. recommendation 지시 사항
                - 각 지역에 대한값을 바탕으로 해당 지역의 여행을 추천하는 문장을 작성해 주세요.
                - 이 추천 문장은 **recommendation**이라는 키에 추가해 주세요.
            8. 관광지 이름은 짧게 반환해주세요.
            9. **최종 반환 예시**는 다음과 같은 형식을 따르도록 해 주세요:
                {
                    "result": {
                        "1": {
                            "places": []
                        },
                        "2": {
                            "places": []
                        },
                        "A04": {
                            "places": []
                        },
                        "recommendation": ""
                    }
                }
            - 요청한 형식 이외의 설명 없이 JSON 형식이 아닌 텍스트는 절대 반환하지 말고, 항상 JSON 문자열로만 반환해 주세요.
            - **Respond with valid JSON only. No extra text, no markdown.**
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    if (!response) throw new Error('No response from AI');

    // console.log(JSON.parse(response.text || '{}'));

    const aiResponseObj = JSON.parse(response.text || '{}') as AIResponseObj;
    const gptComment = aiResponseObj.result['recommendation'];

    const categoryObj: Record<string, string> = {
      A01: '자연',
      A02: '역사',
      A03: '레저',
      A04: '쇼핑',
    };

    let places: string[] = [];
    const categoryOptions: string[] = [];

    if (Object.keys(aiResponseObj.result).length === 2) {
      for (const key of Object.keys(aiResponseObj.result)) {
        if (key !== 'recommendation') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          places = [...places, ...aiResponseObj.result[key]['places']];
        }
      }
    } else {
      for (const key of Object.keys(aiResponseObj.result)) {
        if (categoryObj[key]) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          places = [...places, ...aiResponseObj.result[key]['places']];
          categoryOptions.push(key);
        }
      }
    }

    console.log(places);

    let categoryQuery = '';
    if (categoryOptions.length > 0) {
      categoryQuery = categoryOptions
        .map((c) => `A.cat1 = '${c}'`)
        .join(' OR ');
    } else {
      categoryQuery = "A.contenttypeid = '12'";
    }

    const queryConditionsStr = places
      .map((d) => `A.title ILIKE '%${d}%'`)
      .join(' OR ');

    const sql = `
      SELECT B.*
      FROM non_blank_tourist_spot A
      JOIN tourist_spot B ON A.contentid = B.contentid
      WHERE (${categoryQuery}) AND (${queryConditionsStr})
    `.trim();

    const touristSpots: TouristSpot[] =
      await this.touristSpotRepository.query(sql);

    const touristSpotItems: TouristSpotItem[] = touristSpots.map((spot) => {
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

    return new AIPlannerItem.Builder()
      .setPlaces(touristSpotItems)
      .setRecommendation(gptComment)
      .build();
  }
}
