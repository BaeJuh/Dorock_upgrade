export class DetailItem {
  private addr1: string;
  private addr2: string;
  private title: string;
  private firstimage: string;
  private mapx: number;
  private mapy: number;
  private recommendation: string;

  constructor(builder: InstanceType<typeof DetailItem.Builder>) {
    this.addr1 = builder.addr1;
    this.addr2 = builder.addr2;
    this.title = builder.title;
    this.firstimage = builder.firstimage;
    this.mapx = builder.mapx;
    this.mapy = builder.mapy;
    this.recommendation = builder.recommendation;
  }

  static Builder = class {
    public addr1: string;
    public addr2: string;
    public title: string;
    public firstimage: string;
    public mapx: number;
    public mapy: number;
    public recommendation: string;

    public setAddr1(addr1: string): this {
      this.addr1 = addr1;
      return this;
    }

    public setAddr2(addr2: string): this {
      this.addr2 = addr2;
      return this;
    }

    public setTitle(title: string): this {
      this.title = title;
      return this;
    }

    public setFirstimage(firstimage: string): this {
      this.firstimage = firstimage;
      return this;
    }

    public setMapx(mapx: number): this {
      this.mapx = mapx;
      return this;
    }

    public setMapy(mapy: number): this {
      this.mapy = mapy;
      return this;
    }

    public setRecommendation(recommendation: string): this {
      this.recommendation = recommendation;
      return this;
    }

    build() {
      return new DetailItem(this);
    }
  };
}
