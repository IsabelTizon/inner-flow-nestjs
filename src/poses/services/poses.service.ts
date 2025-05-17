import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';
import { createPoseDto, updatePoseDto } from '../dtos/pose.dto';

export interface Poses {
  id: string;
  name: string;
  description: string;
  image: string;
}

@Injectable()
export class PosesService {
  // poses DDBB simulator
  private posesDDBB: Poses[] = [
    {
      id: uuidv4(),
      name: 'Perro boca abajo',
      image: 'downward-dog-abajo.jpg',
      description:
        'Estira la espalda y fortalece los brazospara hacer el erro boca abajo.',
    },
    {
      id: uuidv4(),
      name: 'Perro boca arriba',
      image: 'downward-dog-arriba.jpg',
      description:
        'Estira la espalda y fortalece los brazos para hacer el erro boca arriba.',
    },
    {
      id: uuidv4(),
      name: 'Perro boca medio',
      image: 'downward-dog-medio.jpg',
      description:
        'Estira la espalda y fortalece los brazospara hacer el erro boca medio.',
    },
  ];

  //
  getAll(): Poses[] {
    return this.posesDDBB;
  }

  getOne(id: string): Poses | undefined {
    console.log(`Getting pose with id: ${id}`);
    const pose = this.posesDDBB.find((pose) => pose.id === id);

    if (!pose) {
      console.log(`Pose with id ${id} not found`);
      throw new NotFoundException(`Pose with id ${id} not found`);
    }
    return pose;
  }

  addPose(poseDto: createPoseDto): void {
    const newPose: Poses = {
      id: uuidv4(),
      ...poseDto,
    };
    this.posesDDBB.push(newPose);
  }

  delete(id: string): void {
    console.log('Deleting pose with id:', id);
    this.posesDDBB = this.posesDDBB.filter((pose) => pose.id !== id);
  }

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
}
