import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';
import { addPoseDto } from '../dtos/add-pose.dto';

export interface Poses {
  id: string;
  name: string;
  description: string;
  image: string;
}

@Injectable()
export class PosesService {
  // poses DDBB simulator
  private poses: Poses[] = [
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
    return this.poses;
  }

  getOne(id: string): Poses | undefined {
    console.log(`Getting pose with id: ${id}`);
    const pose = this.poses.find((pose) => pose.id === id);

    if (!pose) {
      console.log(`Pose with id ${id} not found`);
      throw new NotFoundException(`Pose with id ${id} not found`);
    }
    return pose;
  }

  addPose(poseDto: addPoseDto): void {
    const newPose: Poses = {
      id: uuidv4(),
      ...poseDto,
    };
    this.poses.push(newPose);
  }

  delete(id: string): void {
    console.log('Deleting pose with id:', id);
    this.poses = this.poses.filter((pose) => pose.id !== id);
  }
}
