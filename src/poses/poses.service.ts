import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface Poses {
  id: string;
  name: string;
  description: string;
  image: string;
}

@Injectable()
export class PosesService {
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
}
