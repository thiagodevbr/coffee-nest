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
  getAllCoffees(): Coffee[] {
    return this.coffeeService.findAll();
  }

  @Get(':id')
  getOneCoffee(@Param() { id }: IResquest): Coffee {
    return this.coffeeService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateCoffeeDTO): Coffee {
    const coffee = this.coffeeService.create(body);
    return coffee;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateCoffeDTO): Coffee {
    const coffee = this.coffeeService.update(id, body);
    return coffee;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.coffeeService.remove(id);
    return `this action deletes ${id} coffee`;
  }
}
