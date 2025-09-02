import { UserRole } from '../models/user.model';

// New modeel created to exclude sensitive fields like passwordHash
export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
