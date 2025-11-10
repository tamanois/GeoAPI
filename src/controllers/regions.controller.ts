import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RegionsService } from '../services/regions.service';
import { CreateRegionDto, RegionDto, UpdateRegionDto } from '../dto/region.dto';
import { ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from '../guards/api-key.guard';

@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Get()
  async findAll() {
    const regions = await this.regionsService.findAll();
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
