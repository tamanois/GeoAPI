module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'geoapi',
  entities: ['src/entities/*.ts'],
  migrations: ['src/migrations/*.{ts,js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  synchronize: false,
};
