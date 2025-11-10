import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from '../entities/region.entity';
import { RegionSearchParams } from '../controllers/regions.controller';

@Injectable()
export class RegionsService {
  private readonly logger = new Logger(RegionsService.name);
  constructor(
    @InjectRepository(Region)
    private readonly regionRepo: Repository<Region>,
  ) {}

  async findAll(options?: RegionSearchParams): Promise<Region[]> {
    this.logger.log('Fetching all regions');
    const qb = this.regionRepo.createQueryBuilder('region');
    // Unaccent helper
    function normalize(str: string): string {
      return str
        ? str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
        : '';
    }
    if (options?.search) {
      const searchNorm = normalize(options.search);
      qb.where('LOWER(region.name) LIKE :search', { search: `%${searchNorm}%` });
    }
    if (options?.countryCode) {
      qb.andWhere('region.countryCode = :countryCode', { countryCode: options.countryCode });
    }
    if (options?.sort) {
      qb.orderBy(`region.${options.sort}`, options.order || 'ASC');
    }
    let limit = options?.limit;
    if (limit && limit > 100) {
      limit = 100;
    }
    
    qb.limit(limit || 50);
    
    if (options?.offset) {
      qb.offset(options.offset);
    }
    return qb.getMany();
  }

  async findOne(id: string): Promise<Region | null> {
    this.logger.log(`Fetching region with id: ${id}`);
    return this.regionRepo.findOne({ where: { id } });
  }

  async create(entity: Partial<Region>): Promise<Region> {
    this.logger.log('Creating new region');
    return this.regionRepo.save(entity);
  }

  async update(id: string, entity: Partial<Region>): Promise<Region | null> {
    this.logger.log(`Updating region with id ${id}`);
    await this.regionRepo.update(id, entity);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting region with id ${id}`);
    await this.regionRepo.delete(id);
  }
}
