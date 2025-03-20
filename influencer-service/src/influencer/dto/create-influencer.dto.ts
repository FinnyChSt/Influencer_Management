//TODO create enum for types

import { IsArray, IsString } from 'class-validator';

export class CreateInfluencerDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsArray({ each: true })
  socialMedia: Array<{
    type: string;
    username: string;
  }>;
}
