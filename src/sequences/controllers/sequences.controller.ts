import { Controller, Get } from '@nestjs/common';
import { SequencesService } from '../services/sequences.service';
import { Sequence } from '../models/sequence.model';

@Controller('sequences')
export class SequencesController {
  constructor(private readonly sequences: SequencesService) {}
  @Get()
  getAll(): Sequence[] {
    return this.sequences.getAll();
  }
}
