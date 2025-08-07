// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';

//MODULES
import { Module } from '@nestjs/common';
import { PosesModule } from '../poses/poses.module';

// MODELS
import { Poses } from '../poses/models/poses.model';
import { User } from './models/user.model';
import { Sequence } from './models/sequence.model';

//SERVICES
import { UsersService } from './services/users.service';
//CONTROLLERS
import { UsersController } from './controllers/users.controller';

// JWT
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './roles/jwt.strategy';

// ENVIRONMENT VARIABLES
import 'dotenv/config';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined');
}

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  imports: [
    PosesModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtSecret,
      signOptions: {
        expiresIn: '24h', // 24 hours
      },
    }),
    TypeOrmModule.forFeature([Poses, User, Sequence]),
  ],
})
export class UsersModule {}
