import { Module } from '@nestjs/common';
import { PosesService } from './services/poses.service';
import { PosesController } from './controllers/poses.controller';

@Module({
  controllers: [PosesController],
  providers: [PosesService],
  exports: [PosesService],
})
export class PosesModule {}
