import { Injectable } from '@nestjs/common';
import { Sequence } from '../models/sequence.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateSequenceDto, UpdateSequenceDto } from '../dtos/sequence.dto';
import { PosesService } from '../../poses/services/poses.service';
// import { Poses }: Imports the pose service, which is needed to look up poses referenced by ID in sequences
import { Poses } from '../../poses/models/poses.model';

@Injectable()
export class SequencesService {
  // Simulates a temporary sequence database.
  // = []: It is initialized as an empty array.
  private sequencesDDBB: Sequence[] = [];

  //Injects the PosesService so you can search for poses by ID. Mark it as private readonly so it can only be used within the service and not modified.
  constructor(private readonly posesService: PosesService) {}

  // CREATE A SEQUENCE
  // sequenceDto.poses is an array of strings ['pose1', 'pose2', 'pose3'].
  createSequence(sequenceDto: CreateSequenceDto): void {
    const poses: Poses[] = sequenceDto.poses
      //.map((poseId) => { ... }): For each poseId, it attempts to find the actual pose using posesService.getOne(poseId). If there's an error (e.g., no such ID exists), it returns undefined.
      .map((poseId) => {
        try {
          return this.posesService.getOne(poseId);
        } catch {
          return undefined;
        }
      })
      // filter undefined values to ensure that only valid poses are included in the new sequence.
      .filter((p): p is Poses => p !== undefined);

    // Creates a newsequence object
    const newSequence: Sequence = {
      id: uuidv4(),
      name: sequenceDto.name,
      poses,
      userId: sequenceDto.userId,
    };

    this.sequencesDDBB.push(newSequence);
  }

  // GET ALL THE USER SEQUENCES
  getSequencesByUserId(userId: string): Sequence[] {
    return this.sequencesDDBB.filter((sequence) => sequence.userId === userId);
  }

  // GET A SEQUENCE BY ID
  // The function getOneSequenece takes a parametrer id of type string and returns a Sequence object or undefined if it doesn't exist.
  getOneSequence(id: string): Sequence | undefined {
    return this.sequencesDDBB.find((s) => s.id === id);
  }

  // DELETE A SEQUENCE BY ID
  // The void type indicates that the function returns nothing.
  deleteSequence(id: string): void {
    // filter creates a new array containing only the sequences whose id does not match the one we want to delete. And we overwrite the original array (this.sequencesDDBB =) with the filtered result.
    this.sequencesDDBB = this.sequencesDDBB.filter((s) => s.id !== id);
  }

  // 💡 UPDATE A SEQUENCE BY ID
  // The void type indicates that the function returns nothing.
  // Receives 2 parameters: id and updateDto
  updateSequence(id: string, updateDto: UpdateSequenceDto): void {
    //Find the index
    const i = this.sequencesDDBB.findIndex((s) => s.id === id);
    // If there is not a sequence with that id just skip the function
    if (i === -1) return;

    //Saves the current sequence (before updating it), so that its data can be used if not all fields are updated.
    const existingSequence = this.sequencesDDBB[i];

    // new variables to store the updated poses
    // updatedPoses: Poses[] | undefined;: This means that updatedPoses can either be an array of Poses or undefined.
    let updatedPoses: Poses[] | undefined;

    // updateDto.poses is an array of strings ['pose1', 'pose2', 'pose3'].
    if (updateDto.poses) {
      updatedPoses = updateDto.poses
        .map((poseId) => {
          try {
            return this.posesService.getOne(poseId);
          } catch {
            return undefined;
          }
        })
        // filter undefined values to ensure that only valid poses are included.
        .filter((p): p is Poses => p !== undefined);
    }

    // We use the spread operator (...existingSequence) to copy your previous data.
    this.sequencesDDBB[i] = {
      ...existingSequence,
      name: updateDto.name ?? existingSequence.name,
      poses: updatedPoses ?? existingSequence.poses,
    };
  }
}
