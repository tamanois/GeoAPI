import { CountriesService } from '../../src/services/countries.service';
import { Repository } from 'typeorm';
import { Country } from '../../src/entities/country.entity';

describe('CountriesService', () => {
  let service: CountriesService;
  let repo: jest.Mocked<Repository<Country>>;

  beforeEach(() => {
    repo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
    service = new CountriesService(repo as any);
  });

  it('should fetch all countries', async () => {
    repo.find.mockResolvedValue([{ id: '1', name: 'Test', code: 'TST', createdAt: new Date(), updatedAt: new Date() } as Country]);
    const result = await service.findAll();
    expect(result).toHaveLength(1);
    expect(repo.find).toHaveBeenCalled();
  });
});
