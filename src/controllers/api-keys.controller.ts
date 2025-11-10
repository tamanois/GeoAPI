import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Logger, UseGuards } from '@nestjs/common';
import { ApiKeysService } from '../services/api-keys.service';
import { CreateApiKeyDto, UpdateApiKeyDto, ApiKeyDto } from '../dto/api-key.dto';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { ApiSecurity } from '@nestjs/swagger';

@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('api-keys')
export class ApiKeysController {
  private readonly logger = new Logger(ApiKeysController.name);

  constructor(private readonly apiKeysService: ApiKeysService) {}

  // @Get()
  // async findAll() {
  //   const keys = await this.apiKeysService.findAll();
  //   return keys.map(ApiKeyDto.fromEntity);
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   const key = await this.apiKeysService.findOne(id);
  //   if (!key) {
  //     throw new NotFoundException(`API with id ${id} not found`);
  //   }
  //   return ApiKeyDto.fromEntity(key);
  // }

  // @Post()
  // async create(@Body() dto: CreateApiKeyDto) {
  //   const entity = ApiKeyDto.toEntity(dto);
  //   const key = await this.apiKeysService.create(entity);
  //   return ApiKeyDto.fromEntity(key);
  // }

  // @Put(':id')
  // async update(@Param('id') id: string, @Body() dto: UpdateApiKeyDto) {
  //   const entity = ApiKeyDto.toEntity(dto);
  //   const key = await this.apiKeysService.update(id, entity);
  //   if (!key) {
  //     throw new NotFoundException(`API key with id ${id} not found`);
  //   }
  //   return ApiKeyDto.fromEntity(key);
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   await this.apiKeysService.delete(id);
  //   return { deleted: true };
  // }
}
