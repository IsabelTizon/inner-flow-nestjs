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
} from '@nestjs/common';
import { Poses } from '../models/poses.model';
import { PosesService } from '../services/poses.service';
import { ParseUUIDPipe } from '@nestjs/common';
import { createPoseDto, updatePoseDto } from '../dtos/pose.dto';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../../users/roles/jwt-auth.guard';
import { RolesGuard } from '../../users/roles/roles-guard'; // <-- Añade esto (ajusta la ruta si es necesario)
import { Roles } from '../../users/roles/roles.decorator'; // <-- Añade esto (ajusta la ruta si es necesario)
import { UserRole } from '../../users/models/user.model';

@Controller('poses')
export class PosesController {
  constructor(private readonly posesService: PosesService) {}

  // Search for poses by name
  @Get('search')
  async searchPoses(@Query('name') name: string): Promise<Poses[]> {
    const results = await this.posesService.searchByName(name);

    if (results.length === 0) {
      throw new NotFoundException(`No pose found with the name "${name}"`);
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
  @Get(':id')
  async getOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Poses> {
    return await this.posesService.getOne(id);
  }

  // Create a new pose
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
