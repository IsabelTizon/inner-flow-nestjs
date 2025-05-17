import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { PosesService, Poses } from '../services/poses.service';
import { ParseUUIDPipe } from '@nestjs/common';
import { createPoseDto, updatePoseDto } from '../dtos/pose.dto';

@Controller('poses')
export class PosesController {
  constructor(private readonly posesService: PosesService) {}

  @Get()
  getAll(): Poses[] {
    return this.posesService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string): Poses | undefined {
    return this.posesService.getOne(id);
  }

  @Post()
  addPose(@Body() pose: createPoseDto): void {
    this.posesService.addPose(pose);
  }

  @Delete(':id')
  deletePose(@Param('id', ParseUUIDPipe) id: string): void {
    this.posesService.delete(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() pose: updatePoseDto,
  ): void {
    this.posesService.update(id, pose);
  }
}
