import { IsString, IsOptional, IsNumber } from 'class-validator';
import { City } from '../entities/city.entity';

export class CreateCityDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsNumber()
  population?: number;

  @IsString()
  countryId!: string;
}

export class UpdateCityDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  population?: number;

  @IsOptional()
  @IsString()
  countryId?: string;
}

export class CityDto {
  id!: string;
  name!: string;
  population?: number;
  countryId!: string;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: City): CityDto {
    return {
      id: entity.id,
      name: entity.name,
      population: entity.population,
      countryId: entity.country?.id,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
    };
  }

  static toEntity(dto: CreateCityDto | UpdateCityDto): Partial<City> {
    return { ...dto };
  }
}
