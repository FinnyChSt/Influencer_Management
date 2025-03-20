import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SocialMedia } from './socailMedia.entity';

@Entity()
export class Influencer {
  @PrimaryGeneratedColumn()
  UId: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => SocialMedia, (socialMedia) => socialMedia.influencer)
  socialMedia: SocialMedia[];
}
