import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/createUser.dto';
import { User } from '../models/user.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':id/sequences')
  //@Param('id') userId: Take the URL parameter called id and store it in the userId variable
  getUserSequences(@Param('id') userId: string) {
    return this.usersService.getUserSequences(userId);
  }
}
