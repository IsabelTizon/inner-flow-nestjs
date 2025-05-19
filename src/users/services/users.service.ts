import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/createUser.dto';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  // A private array of users is created in memory, like a small simulated database
  private users: User[] = [];

  //Create a new user. Receive data from the DTO.
  createUser(createUserDto: CreateUserDto): User {
    //Extracts (deconstructs) the DTO properties: name, email, and password.
    const { name, email, password } = createUserDto;

    //Create a new User object
    const newUser: User = {
      id: uuidv4(),
      name,
      email,
      password,
      sequences: [],
    };

    // Save the new user to the users array
    this.users.push(newUser);
    console.log('New user registered:', newUser);
    return newUser;
  }

  getUserSequences(userId: string) {
    const user = this.users.find((u) => u.id === userId);
    return user?.sequences || [];
  }
}
