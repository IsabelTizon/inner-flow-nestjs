// roles.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../models/user.model';

@Injectable()
// RolesGuard checks if the authenticated user has the required role(s) to access a route.
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Gets the required roles from the route's metadata (set by @Roles).
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    // Gets the user from the request (set by JwtStrategy).
    const request = context
      .switchToHttp()
      .getRequest<{ user: { role: UserRole } }>();
    const user = request.user;

    // Checks if the user's role is included in the required roles.
    return requiredRoles.includes(user.role);
  }
}
