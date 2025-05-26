import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';
import { createPoseDto, updatePoseDto } from '../dtos/pose.dto';
import { DescriptionService } from './description.service';

export interface Poses {
  id: string;
  name: string;
  description: string;
  image: string;
}

@Injectable()
export class PosesService {
  constructor(private readonly description: DescriptionService) {}
  // poses DDBB simulator
  private posesDDBB: Poses[] = [
    {
      id: uuidv4(),
      name: 'Perro boca abajo',
      image: 'downward-dog-abajo.jpg',
      description:
        'Estira la espalda y fortalece los brazos para hacer el perro boca abajo.',
    },
    {
      id: uuidv4(),
      name: 'Perro boca arriba',
      image: 'downward-dog-arriba.jpg',
      description:
        'Estira la espalda y fortalece los brazos para hacer el perro boca arriba.',
    },
    {
      id: uuidv4(),
      name: 'Perro boca medio',
      image: 'downward-dog-medio.jpg',
      description:
        'Estira la espalda y fortalece los brazos para hacer el perro boca medio.',
    },
  ];
  // constructor() {
  //   this.posesDDBB = [
  //     {
  //       id: '05393d7d-74e6-4c08-ab22-44bd203ab63a',
  //       name: 'Downward Dog',
  //       description: 'An inverted V-shaped pose.',
  //       image: 'https://...',
  //     },
  //     {
  //       id: 'b03d7bf2-2d47-48ec-b221-517800f03b6f',
  //       name: "Child's Pose",
  //       description: 'A resting pose.',
  //       image: 'https://...',
  //     },
  //   ];
  // }
  // GET ALL THE POSES
  getAll(): Poses[] {
    return this.posesDDBB;
  }

  // GET ONE POSE BY ID
  getOne(id: string): Poses | undefined {
    console.log(`Getting pose with id: ${id}`);
    const pose = this.posesDDBB.find((p) => p.id === id);

    if (!pose) {
      console.log(`Pose with id ${id} not found`);
      throw new NotFoundException(`Pose with id ${id} not found`);
    }
    return pose;
  }

  // CREATE A NEW POSE
  async addPose(poseDto: createPoseDto): Promise<Poses> {
    const newPose: Poses = {
      id: uuidv4(),
      ...poseDto,
      description: await this.description.createDescription(poseDto),
    };
    this.posesDDBB.push(newPose);
    return newPose;
  }

  //DELETE A POSE BY ID
  delete(id: string): void {
    console.log('Deleting pose with id:', id);
    this.posesDDBB = this.posesDDBB.filter((pose) => pose.id !== id);
  }

  // UPDATE A POSE BY ID
  update(id: string, poseDto: updatePoseDto): void {
    const i = this.posesDDBB.findIndex((p) => p.id === id);

    if (i === -1) {
      throw new NotFoundException(`Pose with id ${id} not found`);
    }

    this.posesDDBB[i] = {
      ...this.posesDDBB[i],
      ...poseDto,
    };
  }

  // SEARCH POSES BY NAME
  searchByName(name: string): Poses[] {
    if (!name) return [];

    const normalize = (text: string) =>
      text
        .trim()
        .replace(/[-\s]+/g, ' ')
        .toLowerCase();

    const normalizedName = normalize(name);

    return this.posesDDBB.filter(
      (pose) => normalize(pose.name) === normalizedName,
    );
  }
}
