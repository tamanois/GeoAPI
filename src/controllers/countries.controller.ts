import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Logger, UseGuards, Query } from '@nestjs/common';
import { CountriesService } from '../services/countries.service';
import { CreateCountryDto, UpdateCountryDto, CountryDto } from '../dto/country.dto';
import { ApiProperty, ApiPropertyOptional, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from '../guards/api-key.guard';

class SearchParams {
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
}

@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('countries')
export class CountriesController {
  private readonly logger = new Logger(CountriesController.name);

  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll(
    @Query() searchParams: SearchParams,
  ) {
    const countries = await this.countriesService.findAllMatching(searchParams);
    return countries.map(CountryDto.fromEntity);
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   const country = await this.countriesService.findOne(id);
  //   if (!country) {
  //     throw new NotFoundException(`Country with id ${id} not found`);
  //   }
  //   return CountryDto.fromEntity(country);
  // }

  // @Post()
  // async create(@Body() dto: CreateCountryDto) {
  //   const entity = CountryDto.toEntity(dto);
  //   const country = await this.countriesService.create(entity);
  //   return CountryDto.fromEntity(country);
  // }

  // @Put(':id')
  // async update(@Param('id') id: string, @Body() dto: UpdateCountryDto) {
  //   const entity = CountryDto.toEntity(dto);
  //   const country = await this.countriesService.update(id, entity);
  //   if (!country) {
  //     throw new NotFoundException(`Country with id ${id} not found`);
  //   }
  //   return CountryDto.fromEntity(country);
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   await this.countriesService.delete(id);
  //   return { deleted: true };
  // }
}
