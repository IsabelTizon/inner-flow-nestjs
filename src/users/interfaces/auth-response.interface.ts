import { SafeUser } from './safe-user.interface';

export interface AuthResponse {
  user: SafeUser; // User change to SafeUser to exclude sensitive fields as passwordHash
  token: string;
}
