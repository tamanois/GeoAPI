import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiKey } from '../entities/api-key.entity';

export class CreateApiKeyDto {
  @IsString()
  key!: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateApiKeyDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class ApiKeyDto {
  id!: string;
  key!: string;
  owner?: string;
  active!: boolean;
  createdAt!: string;
  updatedAt!: string;

  static fromEntity(entity: ApiKey): ApiKeyDto {
    return {
      id: entity.id,
      key: entity.key,
      owner: entity.owner,
      active: entity.active,
      createdAt: entity.createdAt?.toISOString(),
      updatedAt: entity.updatedAt?.toISOString(),
    };
  }

  static toEntity(dto: CreateApiKeyDto | UpdateApiKeyDto): Partial<ApiKey> {
    return { ...dto };
  }
}
