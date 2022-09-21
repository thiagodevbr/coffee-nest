import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCoffeeDTO } from './dtos/create-coffee-dto';
import { UpdateCoffeDTO } from './dtos/update-coffe-dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Café preto',
      brand: 'Café Pelé',
      flavors: ['forte', 'água de batata'],
    },
  ];

  findAll(): Coffee[] {
    return this.coffees;
  }

  findOne(id: string): Coffee {
    const coffee = this.coffees.find((coffee) => coffee.id === +id);
    if (!coffee) throw new NotFoundException(`Coffee ${id} not found`);

    return coffee;
  }

  create({ brand, flavors, id, name }: CreateCoffeeDTO): Coffee {
    const coffee = new Coffee();
    Object.assign(coffee, {
      brand,
      flavors,
      id,
      name,
    });
    this.coffees.push(coffee);
    return coffee;
  }

  update(id: string, updateCoffeeDTO: UpdateCoffeDTO): Coffee {
    const isCoffeeExists = this.coffees.find((coffee) => coffee.id === +id);
    if (isCoffeeExists) {
      isCoffeeExists.brand = updateCoffeeDTO.brand;
      isCoffeeExists.flavors = updateCoffeeDTO.flavors;
      isCoffeeExists.name = updateCoffeeDTO.name;
    }
    return isCoffeeExists;
  }

  remove(id: string): void {
    const coffeeIndex = this.coffees.findIndex((coffee) => coffee.id === +id);
    if (coffeeIndex) this.coffees.splice(coffeeIndex, 1);
  }
}
