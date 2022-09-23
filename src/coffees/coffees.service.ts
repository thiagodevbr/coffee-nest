import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/pagination-query.dto';
import { dataBaseConfig } from 'src/config/database.config';
import { Event } from 'src/events/entities/event.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateCoffeeDTO } from './dtos/create-coffee-dto';
import { UpdateCoffeDTO } from './dtos/update-coffe-dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
  ) {}

  async findAll({ limit, offset }: PaginationQueryDto): Promise<Coffee[]> {
    return await this.coffeeRepository.find({
      relations: { flavors: true },
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string): Promise<Coffee> {
    const coffee = await this.coffeeRepository.findOne({
      where: { id },
      relations: { flavors: true },
    });
    if (!coffee) throw new NotFoundException(`Coffee ${id} not found`);

    return coffee;
  }

  async create({ brand, flavors, name }: CreateCoffeeDTO): Promise<Coffee> {
    const allFlavors = await Promise.all(
      flavors.map((flavor) => this.preloadFlavorByName(String(flavor))),
    );

    const coffee = this.coffeeRepository.create({
      brand,
      flavors: allFlavors,
      name,
    });

    return await this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDTO: UpdateCoffeDTO): Promise<Coffee> {
    const allFlavors =
      updateCoffeeDTO.flavors &&
      (await Promise.all(
        updateCoffeeDTO.flavors.map((flavor) =>
          this.preloadFlavorByName(String(flavor)),
        ),
      ));

    const coffee = await this.coffeeRepository.preload({
      id: id,
      ...updateCoffeeDTO,
      flavors: allFlavors,
    });
    if (!coffee) throw new NotFoundException('Coffee does not exists');
    return await this.coffeeRepository.save(coffee);
  }

  async remove(id: string): Promise<void> {
    const coffee = await this.coffeeRepository.findOne({ where: { id } });
    await this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    const connection = new DataSource({ ...dataBaseConfig, type: 'postgres' });
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffee: coffee.id };
      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const isFlavorExists = await this.flavorRepository.findOne({
      where: { name },
    });
    if (isFlavorExists) return isFlavorExists;
    const flavor = this.flavorRepository.create({ name });
    return await this.flavorRepository.save(flavor);
  }
}
