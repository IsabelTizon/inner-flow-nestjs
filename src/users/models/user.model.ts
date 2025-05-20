import { Sequence } from 'src/users/models/sequence.model';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  sequences: Sequence[];
}
