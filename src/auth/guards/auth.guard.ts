import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NAST_SERVICE } from 'src/shared/constants/NATS_SERVICE';
import { AUTH_SERVICES_NAMES } from '../entities/AuthServicesNames';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(NAST_SERVICE) private readonly client: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('Token was not provided');
      }

      const { user, isExpired } = await firstValueFrom(
        this.client.send({ cmd: AUTH_SERVICES_NAMES.VERIFY_TOKEN }, token),
      );

      if (isExpired) {
        throw new UnauthorizedException('Token expired');
      }

      request['user'] = user;
      request['token'] = token;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
