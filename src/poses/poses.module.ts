// MODULE + SERVICE + CONTROLLER
// @nestjs: common, @nestjs/core, @nestjs/platform-express => Essential components for creating services, modules, and controllers in NestJS applications
import { Module } from '@nestjs/common';
import { PosesService } from './services/poses.service';
import { PosesController } from './controllers/poses.controller';
// AI
// OpenAI service to interact with the OpenAI API for generating pose descriptions
import { DescriptionService } from './services/description.service';
import { AIService } from './services/ai.service';
// DDBB + ORM
// @nestjs/typeorm => ORM for managing the SQLite database with entities, repositories, and migrations.
import { TypeOrmModule } from '@nestjs/typeorm';
// ENTITIES
// Entity model for poses, defining the structure of the poses table in the database
import { Poses } from './models/poses.model';

@Module({
  controllers: [PosesController],
  providers: [PosesService, DescriptionService, AIService],
  exports: [PosesService, DescriptionService],
  imports: [TypeOrmModule.forFeature([Poses])],
})
export class PosesModule {}
