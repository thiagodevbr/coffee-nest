import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDTO } from './dtos/create-coffee-dto';
import { UpdateCoffeDTO } from './dtos/update-coffe-dto';
import { Coffee } from './entities/coffee.entity';

interface IResquest {
  id: string;
}

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeeService: CoffeesService) {}

  @Get()
  async getAllCoffees(
    @Query() pagination: PaginationQueryDto,
  ): Promise<Coffee[]> {
    return await this.coffeeService.findAll(pagination);
  }

  @Get(':id')
  async getOneCoffee(@Param() { id }: IResquest): Promise<Coffee> {
    return await this.coffeeService.findOne(id);
  }

  @Post()
  async create(@Body() body: CreateCoffeeDTO): Promise<Coffee> {
    const coffee = await this.coffeeService.create(body);
    return coffee;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateCoffeDTO,
  ): Promise<Coffee> {
    const coffee = await this.coffeeService.update(id, body);
    return coffee;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.coffeeService.remove(id);
    return `this action deletes ${id} coffee`;
  }
}
