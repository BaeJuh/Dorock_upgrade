export class AreaCodeItem {
  private rnum: number;
  private code: string;
  private name: string;

  private constructor(builder: InstanceType<typeof AreaCodeItem.Builder>) {
    this.rnum = builder.rnum;
    this.code = builder.code;
    this.name = builder.name;
  }

  static Builder = class {
    public rnum: number;
    public code: string;
    public name: string;

    public setRnum(rnum: number): this {
      this.rnum = rnum;
      return this;
    }

    public setCode(code: string): this {
      this.code = code;
      return this;
    }

    public setName(name: string): this {
      this.name = name;
      return this;
    }

    public build(): AreaCodeItem {
      return new AreaCodeItem(this);
    }
  };
}
