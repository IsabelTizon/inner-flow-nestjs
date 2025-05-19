import { Module } from '@nestjs/common';
import { SequencesService } from './services/sequences.service';
import { SequencesController } from './controllers/sequences.controller';

@Module({
  controllers: [SequencesController],
  providers: [SequencesService],
})
export class SequencesModule {}
