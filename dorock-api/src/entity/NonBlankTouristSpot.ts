import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('non_blank_tourist_spot')
export class NonBlankTouristSpot {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false })
  addr1: string;

  @Column()
  addr2: string;

  @Column()
  areacode: string;

  @Column()
  booktour: string;

  @Column()
  cat1: string;

  @Column()
  cat2: string;

  @Column()
  cat3: string;

  @Column()
  contentid: string;

  @Column()
  contenttypeid: string;

  @Column()
  createdtime: Date;

  @Column()
  firstimage: string;

  @Column()
  firstimage2: string;

  @Column()
  cpyrhtdivcd: string;

  @Column()
  mapx: number;

  @Column()
  mapy: number;

  @Column()
  mlevel: string;

  @Column()
  modifiedtime: Date;

  @Column()
  sigungucode: string;

  @Column()
  tel: string;

  @Column()
  title: string;

  @Column()
  zipcode: string;
}
