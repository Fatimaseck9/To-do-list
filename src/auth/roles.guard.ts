import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lire les rôles attendus sur la route
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(), // La fonction findAll()
      context.getClass(),   // La classe  UsersController
    ]);

    if (!requiredRoles) {
      return true; // S'il n'y a pas @Roles() ➔ la route est ouverte
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Décodé par JwtStrategy automatiquement

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Accès interdit : rôle insuffisant');
    }

    return true; // Sinon accès autorisé
  }
}
