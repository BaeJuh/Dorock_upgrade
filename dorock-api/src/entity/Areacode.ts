import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('areacode')
export class Areacode {
  @PrimaryColumn()
  rnum: number;

  @Column({ nullable: false })
  code: string;

  @Column({ nullable: false })
  name: string;
}
