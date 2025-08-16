import { TouristSpotItem } from './TouristSpotItem';

export class AIPlannerItem {
  private places: TouristSpotItem[];
  private recommendation: string;

  constructor(builder: InstanceType<typeof AIPlannerItem.Builder>) {
    this.places = builder.places;
    this.recommendation = builder.recommendation;
  }

  static Builder = class {
    public places: TouristSpotItem[];
    public recommendation: string;

    setPlaces(places: TouristSpotItem[]) {
      this.places = places;
      return this;
    }

    setRecommendation(recommendation: string) {
      this.recommendation = recommendation;
      return this;
    }

    build(): AIPlannerItem {
      return new AIPlannerItem(this);
    }
  };
}
