// POSES CONTROLLER: Handles HTTP requests related to poses

// SERVICES
import { PosesService } from '../services/poses.service'; // Provides methods to interact with the database for poses

// DECORATORS
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common'; // methods to handle HTTP requests for poses

// MODELS
import { Poses } from '../models/poses.model'; // entity for defining the structure of the table in the database

// DTOS
import { createPoseDto, updatePoseDto } from '../dtos/pose.dto'; // classes for data transfer objects for creating and updating poses

// UUIDs
import { ParseUUIDPipe } from '@nestjs/common'; // Validating  UUIDs

// NOT FOUND EXCEPTION
// import { NotFoundException } from '@nestjs/common'; // notfoundexception to handle cases where a pose is not found

// AUTHENTICATION AND AUTHORIZATION
import { JwtAuthGuard } from '../../users/roles/jwt-auth.guard'; // jwt-auth-guard to protect routes that require authentication
import { RolesGuard } from '../../users/roles/roles-guard'; // roles-guard to restrict access based on user roles
import { Roles } from '../../users/roles/roles.decorator'; // roles decorator to specify required roles for accessing certain routes
import { UserRole } from '../../users/models/user.model'; // user role enum to define different user roles in the application

@Controller('poses')
export class PosesController {
  constructor(private readonly posesService: PosesService) {}

  // Search for poses by name
  @Get('search')
  async searchPoses(@Query('name') name: string): Promise<Poses[]> {
    const results = await this.posesService.searchByName(name);

    if (results.length === 0) {
      if (!name || name.trim() === '') {
        return [];
      }
    }

    return results;
  }

  // CRUD operations for poses

  // Get all poses
  @Get()
  async getAll(): Promise<Poses[]> {
    return await this.posesService.getAll();
  }

  // Get one pose by ID
  @Get(':id') // endpoint to get a pose by its ID
  async getOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Poses> {
    return await this.posesService.getOne(id);
  }

  // Create a new pose
  @UseGuards(JwtAuthGuard)
  @Post()
  async addPose(@Body() pose: createPoseDto): Promise<Poses> {
    return await this.posesService.addPose(pose);
  }

  // Delete a pose by ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async deletePose(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.posesService.delete(id);
  }

  // Update a pose by ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() pose: updatePoseDto,
  ): Promise<void> {
    await this.posesService.update(id, pose);
  }
}

// DECORATORS FOR SEQUENCES
// import { Req, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../../users/guards/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
// @Post()
// async createSequence(@Body() dto: CreateSequenceDto, @Req() req) {
//   const user = req.user; // Usuario autenticado
//   return this.sequencesService.create(dto, user.id);
// }

// @UseGuards(JwtAuthGuard)
// @Patch(':id')
// async updateSequence(@Param('id') id: string, @Body() dto: UpdateSequenceDto, @Req() req) {
//   const user = req.user;
//   return this.sequencesService.update(id, dto, user.id);
// }

// @UseGuards(JwtAuthGuard)
// @Delete(':id')
// async deleteSequence(@Param('id') id: string, @Req() req) {
//   const user = req.user;
//   return this.sequencesService.delete(id, user.id);
// }
