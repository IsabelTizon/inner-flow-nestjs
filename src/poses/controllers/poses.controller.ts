import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { PosesService, Poses } from '../poses.service';

@Controller('poses')
export class PosesController {
  constructor(private readonly posesService: PosesService) {}

  @Get()
  getAll(): Poses[] {
    return this.posesService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Poses | undefined {
    return this.posesService.getOne(id);
  }

  @Post()
  addPose(@Body() pose: Poses): void {
    this.posesService.add(pose);
  }
}
