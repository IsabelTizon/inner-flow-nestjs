// MODULES
import { Module } from '@nestjs/common';
import { PosesModule } from './poses/poses.module';
import { UsersModule } from './users/users.module';
import { SequencesModule } from './sequences/sequences.module';

// CONTROLLERS
import { AppController } from './app.controller';

// SERVICES OR PROVIDERS
import { AppService } from './app.service';

// ORM
import { TypeOrmModule } from '@nestjs/typeorm';

// MODELS
import { Poses } from './poses/models/poses.model';
import { User } from './users/models/user.model';
import { Sequence } from './users/models/sequence.model';

@Module({
  imports: [
    PosesModule,
    UsersModule,
    SequencesModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // host: 'localhost',
      // port: 3306,
      // username: 'root',
      // password: 'root',
      database: 'yogaDDBB.sqlite',
      entities: [Poses, User, Sequence],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
