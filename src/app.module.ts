// MODULES
import { Module } from '@nestjs/common';
import { PosesModule } from './poses/poses.module';
import { UsersModule } from './users/users.module';
import { SequencesModule } from './sequences/sequences.module';
import { ContactModule } from './contact/contact.module';
import { PublicSequencesModule } from './community/publicSequences.module';

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
    ContactModule,
    PublicSequencesModule,
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   // host: 'localhost',
    //   // port: 3306,
    //   // username: 'root',
    //   // password: 'root',
    //   database: 'yogaDDBB.sqlite',
    //   entities: [Poses, User, Sequence],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'defaultdb',
      ssl: {
        rejectUnauthorized: false, // This fixes the SSL certificate issue
      },
      entities: [Poses, User, Sequence],
      synchronize: true, // Only for development!
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
