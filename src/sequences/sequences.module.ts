import { Module } from '@nestjs/common';

import { SequencesController } from './sequences.controller';

import { SequencesService } from './sequences.service';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Sequence } from '../users/models/sequence.model';
import { User } from '../users/models/user.model';
import { Poses } from '../poses/models/poses.model';

@Module({
  imports: [TypeOrmModule.forFeature([Sequence, User, Poses])],
  controllers: [SequencesController],
  providers: [SequencesService],
  exports: [SequencesService],
})
export class SequencesModule {}
