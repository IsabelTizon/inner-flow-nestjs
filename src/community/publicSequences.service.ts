import { Injectable } from '@nestjs/common';
import { SequencesService } from '../sequences/sequences.service';
import { Sequence } from '../users/models/sequence.model';

@Injectable()
export class PublicSequencesService {
  constructor(private readonly sequencesService: SequencesService) {}

  async getPublicSequences(): Promise<Sequence[]> {
    return await this.sequencesService.getPublicSequences();
  }

  async getPublicSequence(sequenceId: string): Promise<Sequence> {
    return await this.sequencesService.getPublicSequence(sequenceId);
  }
}
