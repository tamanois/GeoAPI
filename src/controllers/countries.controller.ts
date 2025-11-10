import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Logger, 
  UseGuards
 } from '@nestjs/common';
import { CountriesService } from '../services/countries.service';
import { CreateCountryDto, UpdateCountryDto, CountryDto } from '../dto/country.dto';
import { ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from '../guards/api-key.guard';


@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('countries')
export class CountriesController {
  private readonly logger = new Logger(CountriesController.name);

  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  async findAll() {
    const countries = await this.countriesService.findAll();
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
