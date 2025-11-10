import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesController } from './controllers/countries.controller';
import { CitiesController } from './controllers/cities.controller';
import { ApiKeysController } from './controllers/api-keys.controller';
import { RegionsController } from './controllers/regions.controller';
import { CountriesService } from './services/countries.service';
import { CitiesService } from './services/cities.service';
import { RegionsService } from './services/regions.service';
import { ApiKeysService } from './services/api-keys.service';
import { Country } from './entities/country.entity';
import { City } from './entities/city.entity';
import { ApiKey } from './entities/api-key.entity';
import { Region } from './entities/region.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any || 'sqlite',
      database: process.env.DB_DATABASE || 'geoapi.sqlite',
      entities: [Country, City, ApiKey, Region],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      migrations: [__dirname + '/migrations/*.{ts,js}'],
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Country, City, ApiKey, Region]),
  ],
  controllers: [CountriesController, CitiesController, RegionsController],
  providers: [CountriesService, CitiesService, ApiKeysService, RegionsService],
})
export class AppModule {}
