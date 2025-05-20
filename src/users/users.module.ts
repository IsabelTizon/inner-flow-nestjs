import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { PosesModule } from '../poses/poses.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PosesModule],
})
export class UsersModule {}
