import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { Request } from 'express';
import { ApiKeysService } from '../services/api-keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @Inject(ApiKeysService)
    private readonly apiKeysService: ApiKeysService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-api-key'] as string;
    if (!apiKey || !(await this.apiKeysService.isValid(apiKey))) {
      throw new UnauthorizedException('Invalid or missing API key');
    }
    return true;
  }
}
