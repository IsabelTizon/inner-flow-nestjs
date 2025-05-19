import { Injectable } from '@nestjs/common';
import { Sequence } from '../models/sequence.model';

@Injectable()
export class SequencesService {
  // A private array of users is created in memory, like a small simulated database
  private sequencesDDBB: Sequence[] = [];

  // Create a

  getAll(): Sequence[] {
    return this.sequencesDDBB;
  }

  getOne(id: string): Sequence | undefined {
    console.log(`Getting a sequence with id: ${id}`);
    return this.sequencesDDBB.find((s) => s.id === id);
  }
}
