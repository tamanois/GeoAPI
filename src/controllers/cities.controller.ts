import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Logger, UseGuards, Query } from '@nestjs/common';
import { CitiesService } from '../services/cities.service';
import { CreateCityDto, UpdateCityDto, CityDto } from '../dto/city.dto';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { ApiPropertyOptional, ApiSecurity } from '@nestjs/swagger';


export class CitySearchParams {
  @ApiPropertyOptional()
  search?: string;
  @ApiPropertyOptional()
  sort?: string;
  @ApiPropertyOptional()
  order: 'ASC' | 'DESC' = 'ASC';
  @ApiPropertyOptional()
  limit?: number;
  @ApiPropertyOptional()
  offset?: number;
  @ApiPropertyOptional()
  countryCode?: string;
}

@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('cities')
export class CitiesController {
  private readonly logger = new Logger(CitiesController.name);

  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  async findAll(
    @Query() searchParams: CitySearchParams,
  ) {
    const cities = await this.citiesService.findAll(searchParams);
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
