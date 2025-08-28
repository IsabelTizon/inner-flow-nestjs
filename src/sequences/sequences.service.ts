import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sequence } from '../users/models/sequence.model';
import { User } from '../users/models/user.model';
import { Poses } from '../poses/models/poses.model';
import { CreateSequenceDto } from './dtos/create-sequence.dto';

@Injectable()
export class SequencesService {
  constructor(
    @InjectRepository(Sequence)
    private readonly sequencesRepository: Repository<Sequence>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Poses)
    private readonly posesRepository: Repository<Poses>,
  ) {}

  // GET /sequences/my-sequences - Get current user's sequences
  async getUserSequences(userId: string): Promise<Sequence[]> {
    return this.sequencesRepository.find({
      where: { user: { id: userId } },
      relations: ['poses', 'user'],
    });
  }

  // POST /sequences - Create new sequence for current user
  async createSequence(
    userId: string,
    createSequenceDto: CreateSequenceDto,
  ): Promise<Sequence> {
    // Find the user
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create new sequence
    const newSequence = this.sequencesRepository.create({
      name: createSequenceDto.name,
      description: createSequenceDto.description,
      user,
      poses: [], // Start with empty poses array
    });

    return this.sequencesRepository.save(newSequence);
  }

  // GET /sequences/:id - Get specific sequence
  async getSequence(sequenceId: string, userId: string): Promise<Sequence> {
    const sequence = await this.sequencesRepository.findOne({
      where: { id: sequenceId },
      relations: ['poses', 'user'],
    });

    if (!sequence) {
      throw new NotFoundException('Sequence not found');
    }

    // Check if the sequence belongs to the user
    if (sequence.user.id !== userId) {
      throw new ForbiddenException('You can only access your own sequences');
    }

    return sequence;
  }

  // DELETE /sequences/:id - Delete sequence
  async deleteSequence(sequenceId: string, userId: string): Promise<void> {
    const sequence = await this.getSequence(sequenceId, userId);
    await this.sequencesRepository.remove(sequence);
  }

  // POST /sequences/:id/poses - Add pose to sequence
  async addPoseToSequence(
    sequenceId: string,
    poseId: string,
    userId: string,
  ): Promise<Sequence> {
    // Get the sequence (this will check ownership)
    const sequence = await this.getSequence(sequenceId, userId);

    // Find the pose
    const pose = await this.posesRepository.findOne({
      where: { id: poseId },
    });

    if (!pose) {
      throw new NotFoundException('Pose not found');
    }

    // Check if pose is already in sequence
    const poseAlreadyExists = sequence.poses.some((p) => p.id === poseId);
    if (poseAlreadyExists) {
      throw new ForbiddenException('Pose is already in this sequence');
    }

    // Add pose to sequence
    sequence.poses.push(pose);
    return this.sequencesRepository.save(sequence);
  }

  async removePoseFromSequence(
    sequenceId: string,
    poseId: string,
    userId: string,
  ): Promise<Sequence> {
    // Get the sequence (this will check ownership)
    const sequence = await this.getSequence(sequenceId, userId);

    // Remove the pose from the sequence
    sequence.poses = sequence.poses.filter((pose) => pose.id !== poseId);

    return this.sequencesRepository.save(sequence);
  }

  // Public sequence methods
  async getPublicSequences(): Promise<Sequence[]> {
    return this.sequencesRepository.find({
      where: { isPublic: true },
      relations: ['poses', 'user'],
      select: {
        user: {
          id: true,
          name: true,
          email: false, // Don't expose email
        },
      },
    });
  }

  // DELETE /sequences/:id/poses/:poseId - Remove pose from sequence
  async getPublicSequence(sequenceId: string): Promise<Sequence> {
    const sequence = await this.sequencesRepository.findOne({
      where: { id: sequenceId, isPublic: true },
      relations: ['poses', 'user'],
      select: {
        user: {
          id: true,
          name: true,
          email: false, // Don't expose email
        },
      },
    });

    if (!sequence) {
      throw new NotFoundException('Public sequence not found');
    }

    return sequence;
  }

  // PATCH /sequences/:id/toggle-visibility - Toggle sequence public/private status

  async toggleSequenceVisibility(
    sequenceId: string,
    userId: string,
  ): Promise<Sequence> {
    // Get the sequence (this will check ownership)
    const sequence = await this.getSequence(sequenceId, userId);

    // Toggle the public status
    sequence.isPublic = !sequence.isPublic;
    // Save the user sequence in the DDBB: isPublic:1/isNotPublic:0
    return this.sequencesRepository.save(sequence);
  }
}
