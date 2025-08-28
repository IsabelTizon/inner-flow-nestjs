// MODULE + SERVICE + CONTROLLER
import { Module } from '@nestjs/common';

// CONTROLLER
import { PublicSequencesController } from './publicSequences.controller';

// SERVICES
import { PublicSequencesService } from './publicSequences.service';
import { SequencesService } from '../sequences/sequences.service';

// MODELS
import { User } from '../users/models/user.model';
import { Poses } from '../poses/models/poses.model';
import { Sequence } from '../users/models/sequence.model';

// DDBB + ORM
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Sequence, User, Poses])],
  exports: [PublicSequencesService],
  controllers: [PublicSequencesController],
  providers: [PublicSequencesService, SequencesService],
})
export class PublicSequencesModule {}
