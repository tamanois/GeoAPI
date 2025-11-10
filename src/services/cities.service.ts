import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';
import { Country } from '../entities/country.entity';
import { CitySearchParams } from '../controllers/cities.controller';

@Injectable()
export class CitiesService {
  private readonly logger = new Logger(CitiesService.name);

  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async findAll(options?: CitySearchParams): Promise<City[]> {
    this.logger.log('Fetching all cities');
    const qb = this.cityRepository.createQueryBuilder('city').leftJoinAndSelect('city.country', 'country').leftJoinAndSelect('city.region', 'region');
    // Unaccent helper
    function normalize(str: string): string {
      return str
        ? str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
        : '';
    }
    let whereAdded = false;
    if (options?.search) {
      const searchNorm = normalize(options.search);
      qb.where('(LOWER(city.name) LIKE :search OR LOWER(city.cityAscii) LIKE :search)', { search: `%${searchNorm}%` });
      whereAdded = true;
    }
    if (options?.countryCode) {
      if (whereAdded) {
        qb.andWhere('country.code = :countryCode', { countryCode: options.countryCode });
      } else {
        qb.where('country.code = :countryCode', { countryCode: options.countryCode });
        whereAdded = true;
      }
    }
    if (options?.sort) {
      qb.orderBy(`city.${options.sort}`, options.order || 'ASC');
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
