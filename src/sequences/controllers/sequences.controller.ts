import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Body,
} from '@nestjs/common';
import { SequencesService } from '../services/sequences.service';
import { Sequence } from '../models/sequence.model';
import { CreateSequenceDto, UpdateSequenceDto } from '../dtos/sequence.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

@Controller('sequences')
export class SequencesController {
  constructor(private readonly sequences: SequencesService) {}

  @Get()
  getUserSequences(@Param('userId') userId: string): Sequence[] {
    return this.sequences.getSequencesByUserId(userId);
  }

  @Get(':id')
  getOneSequence(@Param('id', ParseUUIDPipe) id: string): Sequence | undefined {
    return this.sequences.getOneSequence(id);
  }

  @Post()
  createSequence(
    @Body(new ValidationPipe())
    sequenceDto: CreateSequenceDto,
  ): void {
    this.sequences.createSequence(sequenceDto);
  }

  @Delete(':id')
  // ParseUUIDPipe: Automatically validate that the value received as a parameter is a valid UUID.
  deleteSequence(@Param('id', ParseUUIDPipe) id: string): void {
    this.sequences.deleteSequence(id);
  }

  @Patch(':id')
  updateSequence(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe())
    updateDto: UpdateSequenceDto,
  ): void {
    this.sequences.updateSequence(id, updateDto);
  }
}
