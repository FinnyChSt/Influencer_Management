import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { InfluencerService } from './influencer.service';
import { Influencer } from './entities/influencer.entity';
import { SocialMedia } from './entities/socailMedia.entity';
import { Repository, DataSource, Like } from 'typeorm';
import { CreateInfluencerDto } from './dto/create-influencer.dto';
import { FilterInfluencerDto } from './dto/filter-influencer.dto';
import { MAX_NAME_LENGTH } from '../utils/validation';

describe('InfluencerService', () => {
  let service: InfluencerService;
  let influencerRepo: jest.Mocked<Repository<Influencer>>;
  let dataSource: jest.Mocked<DataSource>;
  let queryRunner: any;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  };

  beforeEach(async () => {
    const mockInfluencerRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

    const mockSocialMediaRepo = {
      save: jest.fn(),
      create: jest.fn(),
    };

    const mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InfluencerService,
        {
          provide: getRepositoryToken(Influencer),
          useValue: mockInfluencerRepo,
        },
        {
          provide: getRepositoryToken(SocialMedia),
          useValue: mockSocialMediaRepo,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<InfluencerService>(InfluencerService);
    influencerRepo = module.get(getRepositoryToken(Influencer)) as jest.Mocked<
      Repository<Influencer>
    >;
    dataSource = module.get(DataSource) as jest.Mocked<DataSource>;
    queryRunner = mockQueryRunner;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInfluencer', () => {
    it('should throw BadRequestException when first name is too long', async () => {
      const longName = 'a'.repeat(MAX_NAME_LENGTH + 1);
      const dto: CreateInfluencerDto = {
        firstName: longName,
        lastName: 'Mustermann',
        socialMedia: [
          {
            type: 'Instagram',
            username: 'usertest',
          },
        ],
      };

      await expect(service.createInfluencer(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when last name is too long', async () => {
      const longName = 'a'.repeat(MAX_NAME_LENGTH + 1);
      const dto: CreateInfluencerDto = {
        firstName: 'Max',
        lastName: longName,
        socialMedia: [
          {
            type: 'Instagram',
            username: 'usertest',
          },
        ],
      };
      await expect(service.createInfluencer(dto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create an influencer with social media accounts', async () => {
      const dto: CreateInfluencerDto = {
        firstName: 'Max',
        lastName: 'Mustermann',
        socialMedia: [
          {
            type: 'Instagram',
            username: 'MaxMustermann',
          },
          {
            type: 'TikTok',
            username: 'MaxMustermann_tiktok',
          },
        ],
      };

      const savedInfluencer = {
        UId: 1,
        FirstName: 'Max',
        LastName: 'Mustermann',
      };

      queryRunner.manager.save.mockImplementation((entity) => {
        if (entity instanceof Influencer) {
          return Promise.resolve(savedInfluencer);
        } else if (entity instanceof SocialMedia) {
          return Promise.resolve({
            SmId: Math.floor(Math.random() * 1000),
            ...entity,
          });
        }
      });
      await service.createInfluencer(dto);
      expect(dataSource.createQueryRunner).toHaveBeenCalled();
      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.manager.save).toHaveBeenCalledTimes(3);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      const dto: CreateInfluencerDto = {
        firstName: 'Max',
        lastName: 'Mustermann',
        socialMedia: [
          {
            type: 'Instagram',
            username: 'MaxMustermann',
          },
        ],
      };
      queryRunner.manager.save.mockRejectedValueOnce(
        new Error('Database error'),
      );
      await expect(service.createInfluencer(dto)).rejects.toThrow(
        'Database error',
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all influencers with their social media accounts', async () => {
      const expectedResult: Influencer[] = [
        {
          UId: 1,
          firstName: 'Max',
          lastName: 'Mustermann',
          socialMedia: [
            {
              smId: 1,
              type: 'Instagram',
              username: 'MaxMustermann',
              influencer: {
                UId: 1,
                firstName: 'Max',
                lastName: 'Mustermann',
                socialMedia: [],
              },
            },
          ],
        },
      ];

      influencerRepo.find.mockResolvedValue(expectedResult);
      const result = await service.findAll();
      expect(result).toEqual(expectedResult);
      expect(influencerRepo.find).toHaveBeenCalledWith({
        relations: ['socialMedia'],
        order: {
          firstName: 'ASC',
          lastName: 'ASC',
        },
      });
    });
  });

  describe('findByFilter', () => {
    it('should find influencers by first name and last name filters', async () => {
      const filterDto: FilterInfluencerDto = {
        firstName: 'Max',
        lastName: 'Mustermann',
      };
      const expectedResult = [
        {
          UId: 1,
          firstName: 'Max',
          lastName: 'Mustermann',
          socialMedia: [],
        },
      ];

      influencerRepo.find.mockResolvedValue(expectedResult);
      const result = await service.findByFilter(filterDto);
      expect(result).toEqual(expectedResult);
      expect(influencerRepo.find).toHaveBeenCalledWith({
        where: {
          firstName: Like(`%${filterDto.firstName}%`),
          lastName: Like(`%${filterDto.lastName}%`),
        },
        relations: ['socialMedia'],
        order: {
          firstName: 'ASC',
          lastName: 'ASC',
        },
      });
    });
  });
});
