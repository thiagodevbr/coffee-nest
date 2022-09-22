import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Coffee } from './coffee.entity';

@Entity('flavor')
export class Flavor {
  @PrimaryColumn()
  id?: string;

  @Column()
  name: string;

  @ManyToMany((type) => Coffee, (coffee) => coffee.flavors)
  coffees: Coffee[];

  constructor() {
    this.id ? this.id : (this.id = uuid());
  }
}
