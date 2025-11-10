import { AppDataSource } from '../../data-source';
import { Country } from '../entities/country.entity';
import { City } from '../entities/city.entity';
import { Region } from '../entities/region.entity';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse';

async function seed() {
  await AppDataSource.initialize();
  const countryRepo = AppDataSource.getRepository(Country);
  const cityRepo = AppDataSource.getRepository(City);
  const regionRepo = AppDataSource.getRepository(Region);

  const csvPath = path.resolve(__dirname, '../../worldcities.csv');
  const fileStream = fs.createReadStream(csvPath);
  const parser = fileStream.pipe(parse({ columns: true, skip_empty_lines: true }));

  const countriesMap = new Map<string, Country>();
  const regionsMap = new Map<string, Region>();
  let cityCount = 0;
  let countryCount = 0;
  let regionCount = 0;
  let errorCount = 0;
  for await (const row of parser) {
    try {
      const countryName = row['country'] || '';
      const countryCode = row['iso2'] || '';
      const cityName = row['city'] || '';
      const cityAscii = row['city_ascii'] || '';
      const cityPop = parseInt(row['population'] || '0', 10);
      const regionName = row['admin_name'] || '';
      const capital = (row['capital'] || '').toLowerCase() === 'primary';

      // Helper to normalize (remove accents, lowercase, trim)
      function normalize(str: string): string {
        return str
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .toLowerCase()
          .trim();
      }

      // Seed country if not exists (local map only)
      let country = countriesMap.get(countryCode);
      if (!country) {
        country = countryRepo.create({
          name: countryName,
          code: countryCode,
          population: 0,
        });
        await countryRepo.save(country);
        countriesMap.set(countryCode, country);
        countryCount++;
        console.log(`Country added: ${countryName} (${countryCode})`);
      }

      // Seed region if not exists, only if region name (normalized, no accent) != city name (normalized, no accent)
      let region: Region | undefined = undefined;
      const regionKey = `${regionName}|${countryCode}`;
      if (regionName && normalize(regionName) !== normalize(cityName)) {
        region = regionsMap.get(regionKey);
        if (!region) {
          region = regionRepo.create({
            name: regionName,
            countryCode,
          });
          await regionRepo.save(region);
          regionsMap.set(regionKey, region);
          regionCount++;
          console.log(`Region added: ${regionName} (${countryCode})`);
        }
      }

      // Seed city
      const city = cityRepo.create({
        name: cityName,
        cityAscii,
        population: cityPop,
        capital,
        country,
        region,
      });
      await cityRepo.save(city);
      cityCount++;
      if (cityCount % 1000 === 0) console.log(`Seeded ${cityCount} cities...`);
    } catch (err) {
      errorCount++;
      console.error(`Error seeding row:`, row, err);
    }
  }
  console.log(`Seeding complete: ${countryCount} countries, ${regionCount} regions, ${cityCount} cities, ${errorCount} errors.`);
  await AppDataSource.destroy();
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
