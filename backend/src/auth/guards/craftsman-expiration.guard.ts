import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Craftsman } from 'src/modules/craftsman/craftsman.entity';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Interface for the authenticated request
 */
interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string; role?: string | null };
}

/**
 * Guard that verifies if a craftsman's subscription has not expired
 */
@Injectable()
export class CraftsmanExpirationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Craftsman)
    private readonly craftsmanRepository: Repository<Craftsman>,
  ) {}

  /**
   * Verify if the craftsman can access the route based on the expiration date
   * @param {ExecutionContext} context - The execution context of the request
   * @returns {Promise<boolean>} True if access is granted, otherwise throws an exception
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // Verify if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    // Verify user is authenticated
    if (!request.user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Verify only for craftsmen
    if (request.user.role !== 'artisan') {
      return true; // Non-craftsmen are not subject to this verification
    }

    // Retrieve the craftsman from the database
    const craftsman = await this.craftsmanRepository.findOne({
      where: { userId: request.user.id },
    });

    if (!craftsman) {
      throw new ForbiddenException('Craftsman profile not found');
    }

    if (!craftsman.expirationDate) {
      throw new ForbiddenException(
        'No subscription found. Please subscribe to continue using the platform.',
      );
    }

    // Verify if the subscription has expired
    const now = new Date();
    const expirationDate = new Date(craftsman.expirationDate);

    if (expirationDate < now) {
      throw new ForbiddenException(
        'Your subscription has expired. Please renew to continue using the platform.',
      );
    }

    return true;
  }
}
