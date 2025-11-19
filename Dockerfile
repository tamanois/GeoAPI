# Dockerfile for GeoAPI
# This Dockerfile is optimized for environments with network restrictions
# It uses a Debian-based image which has better package availability

FROM node:20-slim

WORKDIR /app

# Install build dependencies and Python for native modules
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install all dependencies first
RUN npm install --no-audit --no-fund

# Copy application source
COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY data-source.ts ./data-source.ts
COPY ormconfig.js ./ormconfig.js
COPY worldcities.csv ./worldcities.csv

# Build the application
RUN npm run build

# Remove devDependencies to reduce image size
RUN npm prune --production

# Create directory for database
RUN mkdir -p /app/data

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "dist/src/main.js"]
