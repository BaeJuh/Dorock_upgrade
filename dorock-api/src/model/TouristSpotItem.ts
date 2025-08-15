export class TouristSpotItem {
  private id: number;
  private addr1: string;
  private addr2: string;
  private areacode: string;
  private booktour: string;
  private cat1: string;
  private cat2: string;
  private cat3: string;
  private contentid: string;
  private contenttypeid: string;
  private createdtime: Date;
  private firstimage: string;
  private firstimage2: string;
  private cpyrhtdivcd: string;
  private mapx: number;
  private mapy: number;
  private mlevel: string;
  private modifiedtime: Date;
  private sigungucode: string;
  private tel: string;
  private title: string;
  private zipcode: string;

  constructor(builder: InstanceType<typeof TouristSpotItem.Builder>) {
    this.id = builder.id;
    this.addr1 = builder.addr1;
    this.addr2 = builder.addr2;
    this.areacode = builder.areacode;
    this.booktour = builder.booktour;
    this.cat1 = builder.cat1;
    this.cat2 = builder.cat2;
    this.cat3 = builder.cat3;
    this.contentid = builder.contentid;
    this.contenttypeid = builder.contenttypeid;
    this.createdtime = builder.createdtime;
    this.firstimage = builder.firstimage;
    this.cpyrhtdivcd = builder.cpyrhtdivcd;
    this.mapx = builder.mapx;
    this.mapy = builder.mapy;
    this.mlevel = builder.mlevel;
    this.modifiedtime = builder.modifiedtime;
    this.sigungucode = builder.sigungucode;
    this.tel = builder.tel;
    this.title = builder.title;
    this.zipcode = builder.zipcode;
  }

  static Builder = class {
    public id: number;
    public addr1: string;
    public addr2: string;
    public areacode: string;
    public booktour: string;
    public cat1: string;
    public cat2: string;
    public cat3: string;
    public contentid: string;
    public contenttypeid: string;
    public createdtime: Date;
    public firstimage: string;
    public firstimage2: string;
    public cpyrhtdivcd: string;
    public mapx: number;
    public mapy: number;
    public mlevel: string;
    public modifiedtime: Date;
    public sigungucode: string;
    public tel: string;
    public title: string;
    public zipcode: string;

    public setId(id: number): this {
      this.id = id;
      return this;
    }
    public setAddr1(addr1: string): this {
      this.addr1 = addr1;
      return this;
    }
    public setAddr2(addr2: string): this {
      this.addr2 = addr2;
      return this;
    }
    public setAreacode(areacode: string): this {
      this.areacode = areacode;
      return this;
    }
    public setBooktour(booktour: string): this {
      this.booktour = booktour;
      return this;
    }
    public setCat1(cat1: string): this {
      this.cat1 = cat1;
      return this;
    }
    public setCat2(cat2: string): this {
      this.cat2 = cat2;
      return this;
    }
    public setCat3(cat3: string): this {
      this.cat3 = cat3;
      return this;
    }
    public setContentid(contentid: string): this {
      this.contentid = contentid;
      return this;
    }
    public setContenttypeid(contenttypeid: string): this {
      this.contenttypeid = contenttypeid;
      return this;
    }
    public setCreatedtime(createdtime: Date): this {
      this.createdtime = createdtime;
      return this;
    }
    public setFirstimage(firstimage: string): this {
      this.firstimage = firstimage;
      return this;
    }
    public setFirstimage2(firstimage2: string): this {
      this.firstimage2 = firstimage2;
      return this;
    }
    public setCpyrhtdivcd(cpyrhtdivcd: string): this {
      this.cpyrhtdivcd = cpyrhtdivcd;
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
    public setMlevel(mlevel: string): this {
      this.mlevel = mlevel;
      return this;
    }
    public setModifiedtime(modifiedtime: Date): this {
      this.modifiedtime = modifiedtime;
      return this;
    }
    public setSigungucode(sigungucode: string): this {
      this.sigungucode = sigungucode;
      return this;
    }
    public setTel(tel: string): this {
      this.tel = tel;
      return this;
    }
    public setTitle(title: string): this {
      this.title = title;
      return this;
    }
    public setZipcode(zipcode: string): this {
      this.zipcode = zipcode;
      return this;
    }

    public build(): TouristSpotItem {
      return new TouristSpotItem(this);
    }
  };
}
