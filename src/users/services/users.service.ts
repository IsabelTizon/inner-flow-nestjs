import { Injectable } from '@nestjs/common';
import { Poses } from 'src/poses/models/poses.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private posesDDBB: Poses[] = [
    // poses DDBB simulator
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
}
