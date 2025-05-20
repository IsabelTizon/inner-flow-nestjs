import { Module } from '@nestjs/common';
import { SequencesService } from './services/sequences.service';
import { SequencesController } from './controllers/sequences.controller';
import { PosesModule } from '../poses/poses.module';

@Module({
  imports: [PosesModule],
  controllers: [SequencesController],
  providers: [SequencesService],
})
export class SequencesModule {}
