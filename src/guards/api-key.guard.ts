import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Request } from 'express';
import { ApiKeysService } from '../services/api-keys.service';
const TEN_MINUTES = 10 * 60 * 1000;
const CACHE = new Map<string, number>(); // apiKey -> expiry timestamp

@Injectable()
export class ApiKeyGuard implements CanActivate {

  constructor(
    @Inject(ApiKeysService)
    private readonly apiKeysService: ApiKeysService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'] as string;
    if (!apiKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }
    const now = Date.now();
    const expiry = CACHE.get(apiKey);
    if (expiry && expiry > now) {
      // Key is cached and valid
      return true;
    }
    // Not cached or expired, check DB
    const valid = await this.apiKeysService.isValid(apiKey);
    if (!valid) {
      throw new UnauthorizedException('Invalid or missing API key');
    }
    // Cache for 10 min
    CACHE.set(apiKey, now + TEN_MINUTES);
    return true;
  }
}
