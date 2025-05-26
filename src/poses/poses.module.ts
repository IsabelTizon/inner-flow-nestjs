import { Module } from '@nestjs/common';
import { PosesService } from './services/poses.service';
import { PosesController } from './controllers/poses.controller';
import { DescriptionService } from './services/description.service';
import { AIService } from './services/ai.service';

@Module({
  controllers: [PosesController],
  providers: [PosesService, DescriptionService, AIService],
  exports: [PosesService],
})
export class PosesModule {}
