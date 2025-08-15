import { AreaCodeItem } from './AreaCodeItem';
import { TouristSpotItem } from './TouristSpotItem';

export class TripInfoResponse {
  private touristSpot: TouristSpotItem[];
  private areacode: AreaCodeItem[];

  public setTouristSpot(touristSpot: TouristSpotItem[]): this {
    this.touristSpot = touristSpot;
    return this;
  }

  public setAreaCode(areacode: AreaCodeItem[]): this {
    this.areacode = areacode;
    return this;
  }
}
