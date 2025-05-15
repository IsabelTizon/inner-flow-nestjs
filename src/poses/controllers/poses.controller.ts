import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { PosesService, Poses } from '../poses.service';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('poses')
export class PosesController {
  constructor(private readonly posesService: PosesService) {}

  @Get()
  getAll(): Poses[] {
    return this.posesService.getAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Poses | undefined {
    return this.posesService.getOne(id);
  }

  @Post()
  addPose(@Body() pose: Poses): void {
    this.posesService.add(pose);
  }
  @Delete(':id')
  deletePose(@Param('id', ParseUUIDPipe) id: string): void {
    this.posesService.delete(id);
  }
}
