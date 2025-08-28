import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
  Req,
  UseGuards,
  ParseUUIDPipe,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../users/roles/jwt-auth.guard';
import { SequencesService } from './sequences.service';
import { CreateSequenceDto } from './dtos/create-sequence.dto';
import { AddPoseToSequenceDto } from './dtos/add-pose-to-sequence.dto';
import { Sequence } from '../users/models/sequence.model';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

@Controller('sequences')
@UseGuards(JwtAuthGuard)
export class SequencesController {
  constructor(private readonly sequencesService: SequencesService) {}

  // GET /sequences/my-sequences - Get current user's sequences
  @Get('my-sequences')
  async getMySequences(@Req() req: AuthenticatedRequest): Promise<Sequence[]> {
    return this.sequencesService.getUserSequences(req.user.id);
  }

  // POST /sequences - Create new sequence for current user
  @Post()
  async createSequence(
    @Req() req: AuthenticatedRequest,
    @Body(new ValidationPipe()) createSequenceDto: CreateSequenceDto,
  ): Promise<Sequence> {
    return this.sequencesService.createSequence(req.user.id, createSequenceDto);
  }

  // GET /sequences/:id - Get specific sequence
  @Get(':id')
  async getSequence(
    @Param('id', ParseUUIDPipe) sequenceId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<Sequence> {
    return this.sequencesService.getSequence(sequenceId, req.user.id);
  }

  // DELETE /sequences/:id - Delete sequence
  @Delete(':id')
  async deleteSequence(
    @Param('id', ParseUUIDPipe) sequenceId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.sequencesService.deleteSequence(sequenceId, req.user.id);
  }

  // POST /sequences/:id/poses - Add pose to sequence
  @Post(':id/poses')
  async addPoseToSequence(
    @Param('id', ParseUUIDPipe) sequenceId: string,
    @Body(new ValidationPipe()) addPoseDto: AddPoseToSequenceDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<Sequence> {
    return this.sequencesService.addPoseToSequence(
      sequenceId,
      addPoseDto.poseId,
      req.user.id,
    );
  }

  // DELETE /sequences/:id/poses/:poseId - Remove pose from sequence
  @Delete(':id/poses/:poseId')
  async removePoseFromSequence(
    @Param('id', ParseUUIDPipe) sequenceId: string,
    @Param('poseId', ParseUUIDPipe) poseId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<Sequence> {
    return this.sequencesService.removePoseFromSequence(
      sequenceId,
      poseId,
      req.user.id,
    );
  }

  // PATCH /sequences/:id/toggle-visibility - Toggle sequence public/private status
  @Patch(':id/toggle-visibility')
  async toggleSequenceVisibility(
    @Param('id', ParseUUIDPipe) sequenceId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<Sequence> {
    return this.sequencesService.toggleSequenceVisibility(
      sequenceId,
      req.user.id,
    );
  }
}
