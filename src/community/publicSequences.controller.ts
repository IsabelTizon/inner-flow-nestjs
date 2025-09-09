import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { PublicSequencesService } from './publicSequences.service';
import { Sequence } from '../users/models/sequence.model';

@Controller('community')
export class PublicSequencesController {
  constructor(
    private readonly publicSequencesService: PublicSequencesService,
  ) {}

  @Get('sequences')
  async getPublicSequences(): Promise<Sequence[]> {
    return this.publicSequencesService.getPublicSequences();
  }

  @Get('sequences/:id')
  async getPublicSequence(
    @Param('id', ParseUUIDPipe) sequenceId: string,
  ): Promise<Sequence> {
    return this.publicSequencesService.getPublicSequence(sequenceId);
  }
}
