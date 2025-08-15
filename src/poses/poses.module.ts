// MODULE + SERVICE + CONTROLLER
import { Module } from '@nestjs/common';
import { PosesService } from './services/poses.service';
import { PosesController } from './controllers/poses.controller';
// AI
// OpenAI service to interact with the OpenAI API for generating pose descriptions
import { DescriptionService } from './services/description.service';
import { AIService } from './services/ai.service';

// DDBB + ORM
import { TypeOrmModule } from '@nestjs/typeorm';

// MODEL (ENTITIES) database table structure
import { Poses } from './models/poses.model';

@Module({
  controllers: [PosesController],
  providers: [PosesService, DescriptionService, AIService],
  exports: [PosesService, DescriptionService],
  imports: [TypeOrmModule.forFeature([Poses])],
})
export class PosesModule {}
