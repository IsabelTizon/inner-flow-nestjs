import { Module } from '@nestjs/common';
import { PosesService } from './services/poses.service';
import { PosesController } from './controllers/poses.controller';
import { DescriptionService } from './services/description.service';
import { AIService } from './services/ai.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poses } from './models/poses.model';

@Module({
  controllers: [PosesController],
  providers: [PosesService, DescriptionService, AIService],
  exports: [PosesService],
  imports: [TypeOrmModule.forFeature([Poses])],
})
export class PosesModule {}
