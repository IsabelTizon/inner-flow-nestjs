import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PosesModule } from './poses/poses.module';
import { UsersModule } from './users/users.module';
import { SequencesModule } from './sequences/sequences.module';

@Module({
  imports: [PosesModule, UsersModule, SequencesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
