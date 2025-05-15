import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PosesModule } from './poses/poses.module';

@Module({
  imports: [PosesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
