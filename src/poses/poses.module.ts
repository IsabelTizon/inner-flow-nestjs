import { Module } from '@nestjs/common';
import { PosesService } from './services/poses.service';
import { PosesController } from './controllers/poses.controller';
import { DescriptionService } from './services/description.service';

@Module({
  controllers: [PosesController],
  providers: [PosesService, DescriptionService],
  exports: [PosesService],
})
export class PosesModule {}
