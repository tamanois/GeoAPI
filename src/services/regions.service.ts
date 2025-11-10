import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from '../entities/region.entity';

@Injectable()
export class RegionsService {
  private readonly logger = new Logger(RegionsService.name);
  constructor(
    @InjectRepository(Region)
    private readonly regionRepo: Repository<Region>,
  ) {}

  async findAll(): Promise<Region[]> {
    this.logger.log('Fetching all regions');
    return this.regionRepo.find();
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
