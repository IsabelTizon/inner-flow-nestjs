// METHODS IMPORTED
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';

// SERVICES
import { UsersService } from '../services/users.service';

//DTOs
import { UpdateSequenceDto } from '../dtos/sequence.dto';
import { SignUpDto } from '../dtos/sign-up.dto';
import { SignInDto } from '../dtos/sign-in.dto';
import { CreateSequenceDto } from '../dtos/sequence.dto';

// MODELS
import { User } from '../models/user.model';
import { Sequence } from '../models/sequence.model';

// VALIDATION PIPES
import { ValidationPipe, ParseUUIDPipe } from '@nestjs/common';

// INTERFACES
import { AuthResponse } from '../interfaces/auth-response.interface';

// GUARDS
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../roles/jwt-auth.guard';
import { RolesGuard } from '../roles/roles-guard';
import { Roles } from '../roles/roles.decorator';
import { UserRole } from '../models/user.model';

// url path: /users
@Controller('users')
export class UsersController {
  //Injects the UsersService service to apply dependency injection.
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin-only')
  getAdminData() {
    return 'Just for admins!';
  }

  // url path: //users/register
  @Post('register')
  //@Body() extracts the body of the HTTP request (e.g., registration data)
  //createUserDto is the object containing the validated data for the new user.
  // @Body() extracts the body of the HTTP request (e.g., registration data).
  async SignUp(@Body() signUpDto: SignUpDto): Promise<User> {
    //Calls the usersService service to create the user and returns the result.
    return await this.usersService.signUp(signUpDto);
  }

  // SIGN IN
  @Post('login')
  async SignIn(@Body() signInDto: SignInDto): Promise<AuthResponse> {
    return await this.usersService.signIn(signInDto);
  }

  // CREATE A SEQUENCE
  @Post(':id/sequences')
  async createSequence(
    @Param('id', ParseUUIDPipe) userId: string,
    @Body(new ValidationPipe()) sequenceDto: CreateSequenceDto,
  ): Promise<Sequence> {
    sequenceDto.userId = userId;
    return await this.usersService.createSequence(sequenceDto);
  }

  // GET ALL USER SEQUENCES
  @Get(':id/sequences')
  //@Param('id') userId: Take the URL parameter called id and store it in the userId variable
  // @Param('id'): Extracts the ID from the URL.
  // userId: string: Typed as a string.
  getUserSequences(@Param('id') userId: string) {
    //Call the service to get the user's strings with that ID and return them.
    return this.usersService.getUserSequences(userId);
  }

  // GET A SEQUENCE BY USER ID
  @Get(':id/sequences/:sequenceId')
  async getOneSequence(
    @Param('sequenceId', ParseUUIDPipe) sequenceId: string,
  ): Promise<Sequence | null> {
    return await this.usersService.getOneSequence(sequenceId);
  }

  // DELETE A SEQUENCE BY ID
  @Delete(':id/sequences/:sequenceId')
  // ParseUUIDPipe: Automatically validate that the value received as a parameter is a valid UUID.
  async deleteSequence(
    @Param('sequenceId', ParseUUIDPipe) sequenceId: string,
  ): Promise<void> {
    await this.usersService.deleteSequence(sequenceId);
  }

  // UODATE A SEQUENCE BY ID
  @Patch(':id/sequences/:sequenceId')
  async updateSequence(
    @Param('sequenceId', new ParseUUIDPipe()) sequenceId: string,
    @Body(new ValidationPipe())
    updateDto: UpdateSequenceDto,
  ) {
    return await this.usersService.updateSequence(sequenceId, updateDto);
  }
}
