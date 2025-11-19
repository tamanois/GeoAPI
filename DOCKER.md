# Docker Setup for GeoAPI

This document describes how to run GeoAPI using Docker and Docker Compose.

## Architecture

The Docker setup consists of two services:
- **app**: Node.js application running the NestJS API
- **nginx**: Nginx reverse proxy serving as the frontend

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 1.29 or higher)

## Building the Docker Image

### Standard Build

The Dockerfile is configured to build the application from source:

```bash
docker-compose build
```

### Alternative: Build with Pre-compiled Code

If you encounter network issues during Docker build (common in CI environments), you can build the application locally first:

```bash
# Build locally
npm install
npm run build

# Then build Docker image (it will use the existing dist folder)
docker-compose build
```

## Quick Start

1. **Build and start the containers:**
   ```bash
   docker-compose up -d
   ```

2. **Check the status:**
   ```bash
   docker-compose ps
   ```

3. **Access the API:**
   - API endpoints: `http://localhost/api`
   - Swagger documentation: `http://localhost/api/docs` (if enabled)

## Configuration

### Environment Variables

You can customize the application by modifying the environment variables in `docker-compose.yml`:

- `PORT`: Application port (default: 3000)
- `DB_TYPE`: Database type (default: sqlite)
- `DB_DATABASE`: Database path (default: /app/data/geoapi.sqlite)
- `DB_SYNCHRONIZE`: Auto-sync database schema (default: false)
- `API_KEY_HEADER`: Header name for API key (default: x-api-key)
- `SWAGGER_ENABLED`: Enable/disable Swagger UI (default: true)

### Nginx Port

By default, nginx exposes port 80. To change this, edit the `ports` section in `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Change 8080 to your desired port
```

## Common Commands

### Start the containers
```bash
docker-compose up -d
```

### Stop the containers
```bash
docker-compose down
```

### Stop and remove volumes (WARNING: This deletes the database)
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f nginx
```

### Rebuild the application
```bash
docker-compose build
docker-compose up -d
```

### Execute commands in the container
```bash
# Shell access
docker-compose exec app sh

# Run migrations
docker-compose exec app npm run migration:run

# Seed the database
docker-compose exec app npm run seed
```

## Database Initialization

After the first run, you need to initialize the database:

1. **Run migrations:**
   ```bash
   docker-compose exec app npm run migration:run
   ```

2. **Seed the database with CSV data (optional):**
   ```bash
   docker-compose exec app npm run seed
   ```

## Data Persistence

The SQLite database is stored in a Docker volume named `geoapi-data`. This ensures data persists between container restarts.

To backup the database:
```bash
docker-compose exec app cp /app/data/geoapi.sqlite /app/geoapi-backup.sqlite
docker cp geoapi-app:/app/geoapi-backup.sqlite ./geoapi-backup.sqlite
```

## Troubleshooting

### Containers won't start
- Check logs: `docker-compose logs`
- Ensure ports 80 and 3000 are not in use
- Verify Docker daemon is running

### Database errors
- Run migrations: `docker-compose exec app npm run migration:run`
- Check database permissions in the volume

### Nginx 502 Bad Gateway
- Check if app container is healthy: `docker-compose ps`
- View app logs: `docker-compose logs app`
- Ensure app is listening on port 3000

## Development

For development, you can mount the source code as a volume:

```yaml
volumes:
  - ./src:/app/src:ro
  - geoapi-data:/app/data
```

Then rebuild with:
```bash
docker-compose up -d --build
```

## Security Notes

- Change default API keys in production
- Use HTTPS in production (configure nginx SSL/TLS)
- Restrict network access with firewall rules
- Regularly update Docker images

## Production Deployment

For production:
1. Use environment-specific docker-compose files
2. Configure SSL/TLS certificates in nginx
3. Set up proper logging and monitoring
4. Use secrets management for sensitive data
5. Configure backup strategy for the database volume
