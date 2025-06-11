// TypeORM
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// DTOs
import { SignUpDto } from '../dtos/sign-up.dto';
import { SignInDto } from '../dtos/sign-in.dto';
import { CreateSequenceDto, UpdateSequenceDto } from '../dtos/sequence.dto';

// Models
import { Poses } from 'src/poses/models/poses.model';
import { Sequence } from '../models/sequence.model';
import { User } from '../models/user.model';

// Services
import { PosesService } from '../../poses/services/poses.service';

// bcrypt
import { hash, compare } from 'bcrypt';

// JWT
import { JwtService } from '@nestjs/jwt';

// INTERFACES
import { AuthResponse } from '../interfaces/auth-response.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly posesService: PosesService,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Sequence)
    private readonly sequencesRepository: Repository<Sequence>,

    private readonly jwtService: JwtService,
  ) {}

  //REGISTER NEW USER: Receiving data from the DTO.
  async signUp(signUpDto: SignUpDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: signUpDto.email },
    });

    if (existingUser) {
      console.log('User already exists:', existingUser);
      throw new BadRequestException(
        `User with the ${signUpDto.email} already exists`,
      );
    }

    const { name, email, password } = signUpDto;

    try {
      const passwordHash = await hash(password, 10);

      const newUser = this.usersRepository.create({
        name,
        email,
        passwordHash,
        sequences: [],
      });

      await this.usersRepository.save(newUser);
      console.log('New user registered:', newUser);

      return newUser;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error hashing password: ${error.message}`,
        );
      }
      throw new BadRequestException('Error hashing password');
    }
  }

  // SIGN IN
  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: signInDto.email },
    });

    if (!existingUser) {
      console.log('User not found:', signInDto.email);
      throw new BadRequestException(
        `User with email ${signInDto.email} not found`,
      );
    }

    try {
      console.log('Password plain:', signInDto.password);
      console.log('Password hash:', existingUser.passwordHash);

      const matches = await compare(
        signInDto.password,
        existingUser.passwordHash,
      );

      if (!matches) {
        console.log('Password mismatch for user:', signInDto.email);
        throw new BadRequestException('Invalid password');
      }
      console.log('User signed in successfully:', existingUser);
      const token = this.jwtService.sign({ id: existingUser.id });
      return { token };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error comparing passwords: ${error.message}`,
        );
      }
      throw new BadRequestException('Error comparing passwords');
    }
  }

  // GET ALL USER's SEQUENCES
  async getUserSequences(userId: string): Promise<Sequence[]> {
    return this.sequencesRepository.find({
      where: { user: { id: userId } },
      relations: ['poses', 'user'],
    });
  }

  //CREATE A NEW SEQUENCE: Receiving data from the DTO.
  async createSequence(sequenceDto: CreateSequenceDto): Promise<Sequence> {
    const poses = await Promise.all(
      sequenceDto.poses.map(async (poseId) => {
        try {
          const pose = await this.posesService.getOne(poseId);
          return pose;
        } catch {
          console.log(`Pose with ID ${poseId} not found`);
          return undefined;
        }
      }),
    );

    const validPoses = poses.filter((p): p is Poses => p !== undefined);

    const user = await this.usersRepository.findOne({
      where: { id: sequenceDto.userId },
    });
    if (!user) throw new Error('User not found');

    const newSequence = this.sequencesRepository.create({
      name: sequenceDto.name,
      poses: validPoses,
      user,
    });

    await this.sequencesRepository.save(newSequence);
    return newSequence;
  }

  // GET A SEQUENCE BY USER ID
  async getSequencesByUserId(userId: string): Promise<Sequence[]> {
    return this.getUserSequences(userId);
  }

  //GET A SEQUENCE BY ID
  async getOneSequence(id: string): Promise<Sequence | null> {
    return this.sequencesRepository.findOne({
      where: { id },
      relations: ['poses', 'user'],
    });
  }

  //DELETE A SEQUENCE BY ID.
  async deleteSequence(id: string): Promise<void> {
    await this.sequencesRepository.delete(id);
  }

  //UPDATE A SEQUENCE BY ID
  async updateSequence(
    id: string,
    updateDto: UpdateSequenceDto,
  ): Promise<Sequence | undefined> {
    const sequence = await this.sequencesRepository.findOne({
      where: { id },
      relations: ['poses', 'user'],
    });

    if (!sequence) {
      console.log('Sequence not found:', id);
      return;
    }

    if (updateDto.name) {
      sequence.name = updateDto.name;
    }

    if (Array.isArray(updateDto.poses)) {
      const posePromises = updateDto.poses.map((poseId) =>
        this.posesService.getOne(poseId).catch(() => undefined),
      );

      const resolvedPoses = await Promise.all(posePromises);
      const validPoses = resolvedPoses.filter(
        (p): p is Poses => p !== undefined,
      );
      sequence.poses = validPoses;
    }

    await this.sequencesRepository.save(sequence);
    console.log('Sequence updated:', sequence);
    return sequence;
  }
}
