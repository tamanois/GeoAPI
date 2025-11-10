import { DataSource } from 'typeorm';
import { Country } from './src/entities/country.entity';
import { City } from './src/entities/city.entity';
import { ApiKey } from './src/entities/api-key.entity';
import { Region } from './src/entities/region.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'geoapi.sqlite',
  entities: [Country, City, ApiKey, Region],
  migrations: ['src/migrations/*.{ts,js}'],
  synchronize: false,
});
