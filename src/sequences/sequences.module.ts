// MODULE + SERVICE + CONTROLLER
import { Module } from '@nestjs/common';

// DDBB + ORM
import { TypeOrmModule } from '@nestjs/typeorm';

// CONTROLLER
import { SequencesController } from './sequences.controller';

// SERVICES
import { SequencesService } from './sequences.service';

// MODELS
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
