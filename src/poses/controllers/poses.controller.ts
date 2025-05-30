import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { PosesService, Poses } from '../services/poses.service';
import { ParseUUIDPipe } from '@nestjs/common';
import { createPoseDto, updatePoseDto } from '../dtos/pose.dto';
import { NotFoundException } from '@nestjs/common';

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
  @Post()
  async addPose(@Body() pose: createPoseDto): Promise<Poses> {
    return await this.posesService.addPose(pose);
  }

  // Delete a pose by ID
  @Delete(':id')
  async deletePose(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.posesService.delete(id);
  }

  // Update a pose by ID
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() pose: updatePoseDto,
  ): Promise<void> {
    await this.posesService.update(id, pose);
  }
}
