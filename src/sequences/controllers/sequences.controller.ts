import { Controller } from '@nestjs/common';
import { SequencesService } from '../services/sequences.service';

@Controller('sequences')
export class SequencesController {
  constructor(private readonly sequences: SequencesService) {}
}
