import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/createUser.dto';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private users: User[] = [];

  createUser(createUserDto: CreateUserDto): User {
    const { name, email, password } = createUserDto;

    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      password,
      sequences: [],
    };

    this.users.push(newUser);
    console.log('New user registered:', newUser);
    return newUser;
  }

  getUserSequences(userId: string) {
    const user = this.users.find((u) => u.id === userId);
    return user?.sequences || [];
  }
}
