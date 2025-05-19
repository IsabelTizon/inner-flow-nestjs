import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/createUser.dto';
import { User } from '../models/user.model';

// url path: /users
@Controller('users')
export class UsersController {
  //Injects the UsersService service to apply dependency injection.
  constructor(private readonly usersService: UsersService) {}

  // url path: //users/register
  @Post('register')
  //@Body() extracts the body of the HTTP request (e.g., registration data)
  //createUserDto is the object containing the validated data for the new user.
  // @Body() extracts the body of the HTTP request (e.g., registration data).
  createUser(@Body() createUserDto: CreateUserDto): User {
    //Calls the usersService service to create the user and returns the result.
    return this.usersService.createUser(createUserDto);
  }

  // url path: /users/123/sequences
  @Get(':id/sequences')
  //@Param('id') userId: Take the URL parameter called id and store it in the userId variable
  // @Param('id'): Extracts the ID from the URL.
  // userId: string: Typed as a string.
  getUserSequences(@Param('id') userId: string) {
    //Call the service to get the user's strings with that ID and return them.
    return this.usersService.getUserSequences(userId);
  }
}
