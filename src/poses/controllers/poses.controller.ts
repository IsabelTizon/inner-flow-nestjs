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
} from '@nestjs/common';

// MODELS
import { Poses } from '../models/poses.model';

// DTOS
import { createPoseDto, updatePoseDto } from '../dtos/pose.dto';

// UUIDs
import { ParseUUIDPipe } from '@nestjs/common';

// AUTHENTICATION AND AUTHORIZATION
import { JwtAuthGuard } from '../../users/roles/jwt-auth.guard';
import { RolesGuard } from '../../users/roles/roles-guard';
import { Roles } from '../../users/roles/roles.decorator';
import { UserRole } from '../../users/models/user.model';

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

  @Get()
  async getAll(): Promise<Poses[]> {
    return await this.posesService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Poses> {
    return await this.posesService.getOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addPose(@Body() pose: createPoseDto): Promise<Poses> {
    return await this.posesService.addPose(pose);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async deletePose(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.posesService.delete(id);
  }

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
