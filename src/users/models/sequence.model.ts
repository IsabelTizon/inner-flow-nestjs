import { Poses } from '../../poses/models/poses.model';

export class Sequence {
  id: string;
  name: string;
  poses: Poses[];
  userId: string;
}
