// MODULEs
import { Module } from '@nestjs/common';

// SERVICES
import { PosesService } from './services/poses.service';

// CONTROLLERS
import { PosesController } from './controllers/poses.controller';

// AI
import { DescriptionService } from './services/description.service';
import { AIService } from './services/ai.service';

// ORM
import { TypeOrmModule } from '@nestjs/typeorm';

// MODELS
import { Poses } from './models/poses.model';

@Module({
  controllers: [PosesController],
  providers: [PosesService, DescriptionService, AIService],
  exports: [PosesService, DescriptionService],
  imports: [TypeOrmModule.forFeature([Poses])],
})
export class PosesModule {}
