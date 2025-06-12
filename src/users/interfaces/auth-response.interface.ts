import { User } from '../models/user.model';

export interface AuthResponse {
  user: User;
  token: string;
}
