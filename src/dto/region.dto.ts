import { IsString, IsOptional } from 'class-validator';
import { Region } from '../entities/region.entity';

export class CreateRegionDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  countryCode?: string;
}

export class UpdateRegionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  countryCode?: string;
}

export class RegionDto {
  id!: string;
  name!: string;
  countryCode?: string;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: Region): RegionDto {
    return {
      id: entity.id,
      name: entity.name,
      countryCode: entity.countryCode,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
    };
  }

  static toEntity(dto: CreateRegionDto | UpdateRegionDto): Partial<Region> {
    return { ...dto };
  }
}
