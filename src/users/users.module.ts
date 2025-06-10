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

// ENVIRONMENT VARIABLES
import 'dotenv/config';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    PosesModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '180seconds', // 3 minutes
      },
    }),
    TypeOrmModule.forFeature([Poses, User, Sequence]),
  ],
})
export class UsersModule {}
