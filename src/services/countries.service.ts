import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../entities/country.entity';

@Injectable()
export class CountriesService {
  private readonly logger = new Logger(CountriesService.name);

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async findAll(): Promise<Country[]> {
    this.logger.log('Fetching all countries');
    return this.countryRepository.find();
  }

  async findOne(id: string): Promise<Country | null> {
    this.logger.log(`Fetching country with id ${id}`);
    return this.countryRepository.findOne({ where: { id } });
  }

  async create(entity: Partial<Country>): Promise<Country> {
    this.logger.log('Creating new country');
    return this.countryRepository.save(entity);
  }

  async update(id: string, entity: Partial<Country>): Promise<Country | null> {
    this.logger.log(`Updating country with id ${id}`);
    await this.countryRepository.update(id, entity);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting country with id ${id}`);
    await this.countryRepository.delete(id);
  }
}
