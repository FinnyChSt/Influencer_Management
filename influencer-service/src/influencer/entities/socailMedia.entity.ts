import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Influencer } from './influencer.entity';
import { SocialMediaTypes } from '../../utils/socialMedia.constants';

@Entity()
export class SocialMedia {
  @PrimaryGeneratedColumn()
  smId: number;

  @Column()
  username: string;

  @Column({
    type: 'enum',
    enum: SocialMediaTypes,
  })
  type: string;

  @ManyToOne(() => Influencer, (influencer) => influencer.socialMedia)
  @JoinColumn({ name: 'InfluencerUId', referencedColumnName: 'UId' })
  influencer: Influencer;
}
