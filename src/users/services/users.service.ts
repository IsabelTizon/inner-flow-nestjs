import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/createUser.dto';
import { CreateSequenceDto, UpdateSequenceDto } from '../dtos/sequence.dto';
import { Sequence } from '../models/sequence.model';
import { PosesService } from '../../poses/services/poses.service';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { Poses } from 'src/poses/models/poses.model';

@Injectable()
export class UsersService {
  //Injects the PosesService so you can search for poses by ID. Mark it as private readonly so it can only be used within the service and not modified.
  constructor(private readonly posesService: PosesService) {} // Simulates a temporary sequence database.
  // A private array of users is created in memory, like a small simulated database
  private users: User[] = [];
  // = []: It is initialized as an empty array.
  private sequencesDDBB: Sequence[] = [];

  //Create a new user. Receive data from the DTO.
  createUser(createUserDto: CreateUserDto): User {
    //Extracts (deconstructs) the DTO properties: name, email, and password.
    const { name, email, password } = createUserDto;

    //Create a new User object
    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      password,
      sequences: [],
    };

    // Save the new user to the users array
    this.users.push(newUser);
    console.log('New user registered:', newUser);
    return newUser;
  }

  getUserSequences(userId: string) {
    const user = this.users.find((u) => u.id === userId);
    return user?.sequences || [];
  }

  // CREATE A SEQUENCE
  // sequenceDto.poses is an array of strings ['pose1', 'pose2', 'pose3'].
  createSequence(sequenceDto: CreateSequenceDto): Sequence {
    const poses: Poses[] = sequenceDto.poses
      .map((poseId) => {
        try {
          return this.posesService.getOne(poseId);
        } catch {
          return undefined;
        }
      })
      .filter((p): p is Poses => p !== undefined);

    const newSequence: Sequence = {
      id: uuidv4(),
      name: sequenceDto.name,
      poses,
      userId: sequenceDto.userId,
    };

    this.sequencesDDBB.push(newSequence);

    const user = this.users.find((u) => u.id === sequenceDto.userId);
    if (user) {
      user.sequences.push(newSequence);
    }

    return newSequence;
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
  updateSequence(
    id: string,
    updateDto: UpdateSequenceDto,
  ): Sequence | undefined {
    //Find the index
    const i = this.sequencesDDBB.findIndex((s) => s.id === id);
    // If there is not a sequence with that id just skip the function
    if (i === -1) {
      console.log('Sequence not found: ', id);
      return;
    }
    //Saves the current sequence (before updating it), so that its data can be used if not all fields are updated.
    const existingSequence = this.sequencesDDBB[i];
    console.log('Sequence before updated:', existingSequence);

    // new variables to store the updated poses
    // updatedPoses: Poses[] | undefined;: This means that updatedPoses can either be an array of Poses or undefined.
    let updatedPoses: Poses[] | undefined;

    // updateDto.poses is an array of strings ['pose1', 'pose2', 'pose3'].
    if (Array.isArray(updateDto.poses)) {
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
    const updatedSequence = {
      ...existingSequence,
      name: updateDto.name ?? existingSequence.name,
      poses: updatedPoses ?? existingSequence.poses,
    };

    this.sequencesDDBB[i] = updatedSequence;

    console.log('Sequence updated:', updatedSequence);

    return updatedSequence;
  }
}
