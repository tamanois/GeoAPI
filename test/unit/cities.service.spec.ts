import { CitiesService } from '../../src/services/cities.service';
import { Repository } from 'typeorm';
import { City } from '../../src/entities/city.entity';
import { Country } from '../../src/entities/country.entity';

describe('CitiesService', () => {
  let service: CitiesService;
  let cityRepo: jest.Mocked<Repository<City>>;
  let countryRepo: jest.Mocked<Repository<Country>>;

  beforeEach(() => {
    cityRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
    countryRepo = {} as any;
    service = new CitiesService(cityRepo as any, countryRepo as any);
  });

  it('should fetch all cities', async () => {
    cityRepo.find.mockResolvedValue([{ id: '1', name: 'Test City', createdAt: new Date(), updatedAt: new Date() } as City]);
    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(cityRepo.find).toHaveBeenCalled();
  });
});
