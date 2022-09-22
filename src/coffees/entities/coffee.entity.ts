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

  @JoinTable()
  @ManyToMany((type) => Flavor, (flavor) => flavor.coffees)
  flavors: string[];

  constructor() {
    this.id ? this.id : (this.id = uuid());
  }
}
