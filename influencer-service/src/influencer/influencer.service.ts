import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Influencer } from './entities/influencer.entity';
import { Repository, DataSource, Like } from 'typeorm';
import { SocialMedia } from './entities/socailMedia.entity';
import { FilterInfluencerDto } from './dto/filter-influencer.dto';
import { isValidName } from '../utils/validation';

@Injectable()
export class InfluencerService {
  constructor(
    @InjectRepository(Influencer)
    private readonly InfluencerRepo: Repository<Influencer>,
    private readonly dataSource: DataSource,
  ) {}

  async createInfluencer(createInfluencerDto: CreateInfluencerDto) {
    const firstNameResult = isValidName(createInfluencerDto.firstName);
    if (firstNameResult !== true) {
      throw new BadRequestException({
        message: `Invalid Firstname: ${firstNameResult}`,
      });
    }

    const LastNameResult = isValidName(createInfluencerDto.lastName);
    if (LastNameResult !== true) {
      throw new BadRequestException({
        code: `Invalid Lastname: ${LastNameResult}`,
      });
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    if (
      !createInfluencerDto.socialMedia ||
      createInfluencerDto.socialMedia.length < 1
    ) {
      throw new BadRequestException({
        code: 'Please provide at least one social Media account',
      });
    }
    try {
      const newInfluencer = new Influencer();
      newInfluencer.firstName = createInfluencerDto.firstName;
      newInfluencer.lastName = createInfluencerDto.lastName;
      const savedInfluencer = await queryRunner.manager.save(newInfluencer);

      const socialMediaList = [];
      if (
        createInfluencerDto.socialMedia &&
        createInfluencerDto.socialMedia.length > 0
      ) {
        for (const socialMediaItem of createInfluencerDto.socialMedia) {
          const newSocialMedia = new SocialMedia();
          newSocialMedia.type = socialMediaItem.type;
          newSocialMedia.username = socialMediaItem.username;
          newSocialMedia.influencer = savedInfluencer;

          const savedSocialMedia =
            await queryRunner.manager.save(newSocialMedia);
          socialMediaList.push(savedSocialMedia);
        }
      }

      await queryRunner.commitTransaction();

      return {
        ...savedInfluencer,
        socialMedia: socialMediaList,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.InfluencerRepo.find({
      relations: ['socialMedia'],
      order: {
        firstName: 'ASC',
        lastName: 'ASC',
      },
    });
  }

  async findByFilter(filterDto: FilterInfluencerDto) {
    const { firstName: firstName, lastName: lastName } = filterDto;

    return this.InfluencerRepo.find({
      where: {
        firstName: Like(`%${firstName}%`),
        lastName: Like(`%${lastName}%`),
      },
      relations: ['socialMedia'],
      order: {
        firstName: 'ASC',
        lastName: 'ASC',
      },
    });
  }
}
