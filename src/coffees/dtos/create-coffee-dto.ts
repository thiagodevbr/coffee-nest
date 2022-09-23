import { IsString } from 'class-validator';
import { Flavor } from '../entities/flavor.entity';

export class CreateCoffeeDTO {
  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  @IsString({ each: true })
  readonly flavors: Flavor[];
}
