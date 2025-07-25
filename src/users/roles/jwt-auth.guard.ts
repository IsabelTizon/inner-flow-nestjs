//jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// JwtAuthGuard: Protects routes using JWT.
// JwtStrategy: Validates the token and extracts the user.
// RolesGuard: Allows access only if the user has the appropriate role.
// Roles decorator: Marks routes that require certain roles.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {} // JwtAuthGuard is a custom guard that activates Passport's JWT authentication strategy.
