import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UpdateSequenceDto } from '../dtos/sequence.dto';
import { CreateUserDto } from '../dtos/createUser.dto';
import { CreateSequenceDto } from '../dtos/sequence.dto';
import { User } from '../models/user.model';
import { ValidationPipe, ParseUUIDPipe } from '@nestjs/common';
import { Sequence } from '../models/sequence.model';

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

  //
  @Post(':id/sequences')
  async createSequence(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body(new ValidationPipe()) sequenceDto: CreateSequenceDto,
  ): Promise<Sequence> {
    sequenceDto.userId = userId;
    return await this.usersService.createSequence(sequenceDto);
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

  @Get(':id/sequences/:sequenceId')
  getOneSequence(
    @Param('sequenceId', ParseUUIDPipe) sequenceId: string,
  ): Sequence | undefined {
    return this.usersService.getOneSequence(sequenceId);
  }

  @Delete(':id/sequences/:sequenceId')
  // ParseUUIDPipe: Automatically validate that the value received as a parameter is a valid UUID.
  deleteSequence(@Param('sequenceId', ParseUUIDPipe) sequenceId: string): void {
    this.usersService.deleteSequence(sequenceId);
  }

  @Patch(':id/sequences/:sequenceId')
  async updateSequence(
    @Param('sequenceId', new ParseUUIDPipe()) sequenceId: string,
    @Body(new ValidationPipe())
    updateDto: UpdateSequenceDto,
  ) {
    return await this.usersService.updateSequence(sequenceId, updateDto);
  }
}
