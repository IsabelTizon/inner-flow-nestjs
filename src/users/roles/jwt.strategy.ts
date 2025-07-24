// jwt.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

// JwtPayload defines the shape of the JWT payload (what is inside the token).
interface JwtPayload {
  id: string;
  role: string;
}

@Injectable()
// JwtStrategy configures how JWT tokens are validated and how the user info is extracted from the token.
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracts JWT from the Authorization header as a Bearer token.
      ignoreExpiration: false, // Rejects expired tokens.
      secretOrKey: secret, // Uses the secret key from environment variables.
    });
  }

  validate(payload: JwtPayload) {
    return { id: payload.id, role: payload.role };
  }
}
