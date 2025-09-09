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

  async getUserSequences(userId: string): Promise<Sequence[]> {
    return this.sequencesRepository.find({
      where: { user: { id: userId } },
      relations: ['poses', 'user'],
    });
  }

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

  async getSequence(sequenceId: string, userId: string): Promise<Sequence> {
    const sequence = await this.sequencesRepository.findOne({
      where: { id: sequenceId },
      relations: ['poses', 'user'],
    });

    if (!sequence) {
      throw new NotFoundException('Sequence not found');
    }

    if (sequence.user.id !== userId) {
      throw new ForbiddenException('You can only access your own sequences');
    }

    return sequence;
  }

  async deleteSequence(sequenceId: string, userId: string): Promise<void> {
    const sequence = await this.getSequence(sequenceId, userId);
    await this.sequencesRepository.remove(sequence);
  }

  async addPoseToSequence(
    sequenceId: string,
    poseId: string,
    userId: string,
  ): Promise<Sequence> {
    const sequence = await this.getSequence(sequenceId, userId);

    const pose = await this.posesRepository.findOne({
      where: { id: poseId },
    });

    if (!pose) {
      throw new NotFoundException('Pose not found');
    }

    const poseAlreadyExists = sequence.poses.some((p) => p.id === poseId);
    if (poseAlreadyExists) {
      throw new ForbiddenException('Pose is already in this sequence');
    }

    sequence.poses.push(pose);
    return this.sequencesRepository.save(sequence);
  }

  async removePoseFromSequence(
    sequenceId: string,
    poseId: string,
    userId: string,
  ): Promise<Sequence> {
    const sequence = await this.getSequence(sequenceId, userId);

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
          email: false,
        },
      },
    });
  }

  async getPublicSequence(sequenceId: string): Promise<Sequence> {
    const sequence = await this.sequencesRepository.findOne({
      where: { id: sequenceId, isPublic: true },
      relations: ['poses', 'user'],
      select: {
        user: {
          id: true,
          name: true,
          email: false,
        },
      },
    });

    if (!sequence) {
      throw new NotFoundException('Public sequence not found');
    }

    return sequence;
  }

  async toggleSequenceVisibility(
    sequenceId: string,
    userId: string,
  ): Promise<Sequence> {
    const sequence = await this.getSequence(sequenceId, userId);

    sequence.isPublic = !sequence.isPublic;

    return this.sequencesRepository.save(sequence);
  }
}
