import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Flavor } from './flavor.entity';
@Entity()
export class Coffee {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ default: 0 })
  recommendations: number;

  @JoinTable()
  @ManyToMany((type) => Flavor, (flavor) => flavor.coffees, { cascade: true })
  flavors: Flavor[];

  constructor() {
    this.id ? this.id : (this.id = uuid());
  }
}
