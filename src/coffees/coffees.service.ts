import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDTO } from './dtos/create-coffee-dto';
import { UpdateCoffeDTO } from './dtos/update-coffe-dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
  ) {}

  async findAll(): Promise<Coffee[]> {
    return await this.coffeeRepository.find();
  }

  async findOne(id: string): Promise<Coffee> {
    const coffee = await this.coffeeRepository.findOne({ where: { id } });
    if (!coffee) throw new NotFoundException(`Coffee ${id} not found`);

    return coffee;
  }

  async create({ brand, flavors, name }: CreateCoffeeDTO): Promise<Coffee> {
    const coffee = new Coffee();
    Object.assign(coffee, {
      brand,
      flavors,
      name,
    });
    await this.coffeeRepository.save(coffee);
    return coffee;
  }

  async update(id: string, updateCoffeeDTO: UpdateCoffeDTO): Promise<Coffee> {
    await this.coffeeRepository
      .createQueryBuilder()
      .update(Coffee)
      .set(updateCoffeeDTO)
      .where('id = :id', { id })
      .execute();

    return await this.coffeeRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    const coffee = await this.coffeeRepository.findOne({ where: { id } });
    await this.coffeeRepository.remove(coffee);
  }
}
