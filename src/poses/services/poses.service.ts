import { Injectable } from '@nestjs/common';

import { NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

import { createPoseDto, updatePoseDto } from '../dtos/pose.dto';

import { DescriptionService } from './description.service';

import { Poses } from '../models/poses.model';

import * as sqlite3 from 'sqlite3';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PosesService {
  constructor(
    private readonly description: DescriptionService,
    @InjectRepository(Poses)
    private readonly posesRepository: Repository<Poses>,
  ) {
    this.database = new sqlite3.Database('yogaDDBB.sqlite', (error) => {
      if (error) {
        console.error('Error opening yoga DDBB:');
        return;
      }

      this.database.run(
        `CREATE TABLE IF NOT EXISTS poses (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL
        )
        `,
        (error) => {
          if (error) {
            console.error('Error creating poses table:', error);
            return;
          }
          console.log('poses table on yoga DDBB was correctly created');
        },
      );
    });
  }

  private database: sqlite3.Database;

  async getAll(): Promise<Poses[]> {
    return this.posesRepository.find();
  }

  // GET ONE POSE BY ID
  async getOne(id: string): Promise<Poses> {
    console.log(`Getting pose with id: ${id}`);

    return this.posesRepository.findOneOrFail({ where: { id: id } });
  }

  async addPose(poseDto: createPoseDto): Promise<Poses> {
    const description =
      poseDto.description && poseDto.description.trim()
        ? poseDto.description
        : await this.description.createDescription(poseDto);

    const newPose = this.posesRepository.create({
      ...poseDto,
      description,
    });

    await this.posesRepository.save(newPose);
    return newPose;
  }

  //DELETE A POSE BY ID
  async delete(id: string): Promise<void> {
    await this.posesRepository.delete(id);
  }

  // UPDATE A POSE BY ID
  async update(id: string, poseDto: updatePoseDto): Promise<void> {
    const existingPose = await this.posesRepository.findOne({ where: { id } });

    if (!existingPose) {
      throw new NotFoundException(`Pose with id ${id} not found`);
    }

    if (!poseDto.name || !poseDto.image) {
      throw new BadRequestException(
        'Name and image are required to generate a description',
      );
    }

    const updatedDescription = poseDto.description?.trim()
      ? poseDto.description
      : await this.description.createDescription({
          name: poseDto.name,
          image: poseDto.image,
          description: '',
        });

    await this.posesRepository.update(id, {
      name: poseDto.name ?? existingPose.name,
      description: updatedDescription,
      image: poseDto.image ?? existingPose.image,
    });
  }

  searchByName(name: string): Promise<Poses[]> {
    const normalizedName = name
      .trim()
      .replace(/[-\s]+/g, ' ')
      .toLowerCase();

    return new Promise((resolve, reject) => {
      this.database.all(`SELECT * FROM poses`, [], (err, rows) => {
        if (err) return reject(err);

        const results = (rows as Poses[]).filter((pose) =>
          pose.name
            .trim()
            .replace(/[-\s]+/g, ' ')
            .toLowerCase()
            .includes(normalizedName),
        );
        resolve(results);
      });
    });
  }
}
