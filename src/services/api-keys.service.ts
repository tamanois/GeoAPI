import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from '../entities/api-key.entity';

@Injectable()
export class ApiKeysService {
  async findAll(): Promise<ApiKey[]> {
    this.logger.log('Fetching all API keys');
    return this.apiKeyRepository.find();
  }

  async findOne(id: string): Promise<ApiKey | null> {
    this.logger.log(`Fetching API key with id ${id}`);
    return this.apiKeyRepository.findOne({ where: { id } });
  }

  async create(entity: Partial<ApiKey>): Promise<ApiKey> {
    this.logger.log('Creating new API key');
    return this.apiKeyRepository.save(entity);
  }

  async update(id: string, entity: Partial<ApiKey>): Promise<ApiKey | null> {
    this.logger.log(`Updating API key with id ${id}`);
    await this.apiKeyRepository.update(id, entity);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting API key with id ${id}`);
    await this.apiKeyRepository.delete(id);
  }
  private readonly logger = new Logger(ApiKeysService.name);

  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  async isValid(key: string): Promise<boolean> {
    this.logger.debug(`Checking API key: ${key}`);
    const apiKey = await this.apiKeyRepository.findOne({ where: { key, active: true } });
    return !!apiKey;
  }
}
