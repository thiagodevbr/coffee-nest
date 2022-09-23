import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Index(['name', 'type'])
@Entity()
export class Event {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column('json')
  payload: Record<string, any>;

  constructor() {
    this.id ? this.id : (this.id = uuid());
  }
}
