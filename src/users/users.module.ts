import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';

import { UsersController } from './controllers/users.controller';
import { PosesModule } from '../poses/poses.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Poses } from '../poses/models/poses.model';
import { User } from './models/user.model';
import { Sequence } from './models/sequence.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PosesModule, TypeOrmModule.forFeature([Poses, User, Sequence])],
})
export class UsersModule {}
