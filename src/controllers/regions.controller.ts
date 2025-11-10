import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards, Query } from '@nestjs/common';
import { RegionsService } from '../services/regions.service';
import { CreateRegionDto, RegionDto, UpdateRegionDto } from '../dto/region.dto';
import { ApiPropertyOptional, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from '../guards/api-key.guard';

export class RegionSearchParams {
  @ApiPropertyOptional()
  countryCode?: string;
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
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  async findAll(
    @Query() searchParams: RegionSearchParams,
  ) {
    const regions = await this.regionsService.findAll(searchParams);
    return regions.map(r => RegionDto.fromEntity(r));
  }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   const region = await this.regionsService.findOne(id);
  //   if (!region) throw new NotFoundException(`Region with id ${id} not found`);
  //   return RegionDto.fromEntity(region);
  // }

  // @Post()
  // async create(@Body() dto: CreateRegionDto) {
  //   const entity = RegionDto.toEntity(dto);
  //   const region = await this.regionsService.create(entity);
  //   return RegionDto.fromEntity(region);
  // }

  // @Put(':id')
  // async update(@Param('id') id: string, @Body() dto: UpdateRegionDto) {
  //   const entity = RegionDto.toEntity(dto);
  //   const region = await this.regionsService.update(id, entity);
  //   if (!region) throw new NotFoundException(`Region with id ${id} not found`);
  //   return RegionDto.fromEntity(region);
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   await this.regionsService.delete(id);
  //   return { deleted: true };
  // }
}
