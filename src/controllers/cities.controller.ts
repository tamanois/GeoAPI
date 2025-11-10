import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Logger, UseGuards } from '@nestjs/common';
import { CitiesService } from '../services/cities.service';
import { CreateCityDto, UpdateCityDto, CityDto } from '../dto/city.dto';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { ApiSecurity } from '@nestjs/swagger';

@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('cities')
export class CitiesController {
  private readonly logger = new Logger(CitiesController.name);

  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  async findAll() {
    const cities = await this.citiesService.findAll();
    return cities.map(CityDto.fromEntity);
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   const city = await this.citiesService.findOne(id);
  //   if (!city) {
  //     throw new NotFoundException(`City with id ${id} not found`);
  //   }
  //   return CityDto.fromEntity(city);
  // }

  // @Post()
  // async create(@Body() dto: CreateCityDto) {
  //   const entity = CityDto.toEntity(dto);
  //   const city = await this.citiesService.create(entity);
  //   return CityDto.fromEntity(city);
  // }

  // @Put(':id')
  // async update(@Param('id') id: string, @Body() dto: UpdateCityDto) {
  //   const entity = CityDto.toEntity(dto);
  //   const city = await this.citiesService.update(id, entity);
  //   if (!city) {
  //     throw new NotFoundException(`City with id ${id} not found`);
  //   }
  //   return CityDto.fromEntity(city);
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   await this.citiesService.delete(id);
  //   return { deleted: true };
  // }
}
