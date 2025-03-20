import { Module } from '@nestjs/common';
import { InfluencerService } from './influencer.service';
import { InfluencerController } from './influencer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Influencer } from './entities/influencer.entity';
import { SocialMedia } from './entities/socailMedia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Influencer, SocialMedia])],
  controllers: [InfluencerController],
  providers: [InfluencerService],
})
export class InfluencerModule {}
