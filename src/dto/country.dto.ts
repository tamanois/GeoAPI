import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Country } from '../entities/country.entity';

export class CreateCountryDto {
  @IsString()
  name!: string;

  @IsString()
  code!: string;

  @IsOptional()
  @IsNumber()
  population?: number;

  // No region field; region is managed separately
}

export class UpdateCountryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsNumber()
  population?: number;

  // No region field; region is managed separately
}

export class CountryDto {
  id!: string;
  name!: string;
  code!: string;
  population?: number;
  // region?: string;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: Country): CountryDto {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      population: entity.population,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
    };
  }

  static toEntity(dto: CreateCountryDto | UpdateCountryDto): Partial<Country> {
    return { ...dto };
  }
}
