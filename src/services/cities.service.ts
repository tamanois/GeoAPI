import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';
import { Country } from '../entities/country.entity';

@Injectable()
export class CitiesService {
  private readonly logger = new Logger(CitiesService.name);

  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async findAll(): Promise<City[]> {
    this.logger.log('Fetching all cities');
    return this.cityRepository.find({ relations: ['country', 'region'] });
  }

  async findOne(id: string): Promise<City | null> {
    this.logger.log(`Fetching city with id ${id}`);
    return this.cityRepository.findOne({ where: { id }, relations: ['country', 'region'] });
  }

  async create(entity: Partial<City>): Promise<City> {
    this.logger.log('Creating new city');
    return this.cityRepository.save(entity);
  }

  async update(id: string, entity: Partial<City>): Promise<City | null> {
    this.logger.log(`Updating city with id ${id}`);
    await this.cityRepository.update(id, entity);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting city with id ${id}`);
    await this.cityRepository.delete(id);
  }
}
