export enum SocialMediaTypes {
  Instagram = "Instagram",
  TikTok = "TikTok",
}

export interface SocialMedia {
  username: string;
  type: SocialMediaTypes;
}

export interface Influencer {
  firstName: string;
  lastName: string;
  socialMedia: SocialMedia[];
}

export interface InfluencerListSearch {
  firstName: string;
  lastName: string;
}
