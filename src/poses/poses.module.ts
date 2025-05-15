import { Module } from '@nestjs/common';
import { PosesService } from './poses.service';
import { PosesController } from './controllers/poses.controller';

@Module({
  controllers: [PosesController],
  providers: [PosesService],
})
export class PosesModule {}
