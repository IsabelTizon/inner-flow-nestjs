import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { PosesModule } from '../poses/poses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poses } from '../poses/models/poses.model'; // Adjust the import path as necessary

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PosesModule, TypeOrmModule.forFeature([Poses])], // Add your entities here
})
export class UsersModule {}
